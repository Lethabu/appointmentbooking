# services/booking/main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from datetime import datetime, timedelta
from typing import Optional, List
import os
import asyncpg
import json
from contextlib import asynccontextmanager

# Environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
INSTYLE_TENANT_ID = "ccb12b4d-ade6-467d-a614-7c9d198ddc70"

# Pydantic models
class BookingCreate(BaseModel):
    tenant_id: str = INSTYLE_TENANT_ID
    service_id: str
    client_name: str
    client_phone: str
    client_email: Optional[str] = None
    start_time: datetime
    notes: Optional[str] = None
    consent_popia: bool = False

    @validator('client_phone')
    def validate_phone(cls, v):
        # South African phone number validation
        if not v.startswith('+27') and not v.startswith('0'):
            raise ValueError('Phone must be South African format (+27 or 0)')
        return v

    @validator('start_time')
    def validate_future_time(cls, v):
        if v <= datetime.now():
            raise ValueError('Booking time must be in the future')
        return v

class BookingResponse(BaseModel):
    id: str
    tenant_id: str
    service_id: str
    client_name: str
    client_phone: str
    start_time: datetime
    end_time: datetime
    status: str
    created_at: datetime

class ServiceResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    price_zar: int
    duration_minutes: int
    is_active: bool

class DashboardStats(BaseModel):
    todays_bookings: int
    weekly_revenue: float
    monthly_bookings: int
    pending_payments: int

# Database connection pool
db_pool = None

async def get_db_pool():
    global db_pool
    if db_pool is None:
        db_pool = await asyncpg.create_pool(DATABASE_URL)
    return db_pool

async def get_db():
    pool = await get_db_pool()
    async with pool.acquire() as conn:
        yield conn

# FastAPI app initialization
app = FastAPI(
    title="Instyle Booking API",
    description="Hair salon booking system with POPIA compliance",
    version="1.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://instylehairboutique.co.za", "https://appointmentbooking.co.za", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

# Get all services for a tenant
@app.get("/services/{tenant_id}", response_model=List[ServiceResponse])
async def get_services(tenant_id: str, db: asyncpg.Connection = Depends(get_db)):
    query = """
        SELECT id, name, description, price_zar, duration_minutes, is_active
        FROM services 
        WHERE tenant_id = $1 AND is_active = true
        ORDER BY name
    """
    
    rows = await db.fetch(query, tenant_id)
    return [ServiceResponse(**dict(row)) for row in rows]

# Create a new booking
@app.post("/book", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate, db: asyncpg.Connection = Depends(get_db)):
    # Validate POPIA consent
    if not booking.consent_popia:
        raise HTTPException(
            status_code=400, 
            detail="POPIA consent is required for booking"
        )
    
    # Get service details to calculate end time
    service_query = "SELECT duration_minutes FROM services WHERE id = $1 AND tenant_id = $2"
    service = await db.fetchrow(service_query, booking.service_id, booking.tenant_id)
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    end_time = booking.start_time + timedelta(minutes=service['duration_minutes'])
    
    # Check for scheduling conflicts
    conflict_query = """
        SELECT id FROM bookings 
        WHERE tenant_id = $1 
        AND status != 'cancelled'
        AND (
            (start_time <= $2 AND end_time > $2) OR
            (start_time < $3 AND end_time >= $3) OR
            (start_time >= $2 AND end_time <= $3)
        )
    """
    
    conflicts = await db.fetch(conflict_query, booking.tenant_id, booking.start_time, end_time)
    
    if conflicts:
        raise HTTPException(
            status_code=409, 
            detail="Time slot not available - conflicting booking exists"
        )
    
    # Insert booking
    insert_query = """
        INSERT INTO bookings (tenant_id, service_id, client_name, client_phone, 
                            client_email, start_time, end_time, notes, consent_popia)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, tenant_id, service_id, client_name, client_phone, 
                  start_time, end_time, status, created_at
    """
    
    try:
        row = await db.fetchrow(
            insert_query,
            booking.tenant_id, booking.service_id, booking.client_name,
            booking.client_phone, booking.client_email, booking.start_time,
            end_time, booking.notes, booking.consent_popia
        )
        
        return BookingResponse(**dict(row))
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create booking: {str(e)}")

# Get bookings for a tenant
@app.get("/bookings/{tenant_id}", response_model=List[BookingResponse])
async def get_bookings(
    tenant_id: str, 
    limit: int = 50,
    offset: int = 0,
    db: asyncpg.Connection = Depends(get_db)
):
    query = """
        SELECT id, tenant_id, service_id, client_name, client_phone,
               start_time, end_time, status, created_at
        FROM bookings
        WHERE tenant_id = $1
        ORDER BY start_time DESC
        LIMIT $2 OFFSET $3
    """
    
    rows = await db.fetch(query, tenant_id, limit, offset)
    return [BookingResponse(**dict(row)) for row in rows]

# Get dashboard statistics
@app.get("/dashboard/{tenant_id}", response_model=DashboardStats)
async def get_dashboard_stats(tenant_id: str, db: asyncpg.Connection = Depends(get_db)):
    query = "SELECT * FROM get_dashboard_stats($1)"
    
    try:
        row = await db.fetchrow(query, tenant_id)
        if not row:
            return DashboardStats(
                todays_bookings=0,
                weekly_revenue=0.0,
                monthly_bookings=0,
                pending_payments=0
            )
        
        return DashboardStats(
            todays_bookings=row['todays_bookings'],
            weekly_revenue=float(row['weekly_revenue']),
            monthly_bookings=row['monthly_bookings'],
            pending_payments=row['pending_payments']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

# Cancel a booking
@app.patch("/bookings/{booking_id}/cancel")
async def cancel_booking(booking_id: str, db: asyncpg.Connection = Depends(get_db)):
    query = """
        UPDATE bookings 
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1 AND status != 'completed'
        RETURNING id, status
    """
    
    row = await db.fetchrow(query, booking_id)
    
    if not row:
        raise HTTPException(status_code=404, detail="Booking not found or cannot be cancelled")
    
    return {"id": row['id'], "status": row['status'], "message": "Booking cancelled successfully"}

# Startup event
@app.on_event("startup")
async def startup_event():
    await get_db_pool()
    print("🚀 Booking API started successfully")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    global db_pool
    if db_pool:
        await db_pool.close()
    print("👋 Booking API shutdown complete")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
