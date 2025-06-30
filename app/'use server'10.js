'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData) {
  const supabase = createServerActionClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('Unauthorized: You must be logged in to create a product.')
  }

  const { data: salon } = await supabase
    .from('salons')
    .select('id')
    .eq('owner_id', session.user.id)
    .single()

  if (!salon) {
    throw new Error('No salon found for the current user.')
  }

  const name = formData.get('name')
  const description = formData.get('description')
  const price = formData.get('price')
  const stock_quantity = formData.get('stock_quantity')
  const imageFile = formData.get('image')

  // 1. Upload image to Supabase Storage
  const fileName = `${Date.now()}-${imageFile.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('product-images') // Ensure you have a 'product-images' bucket in Supabase Storage
    .upload(`${salon.id}/${fileName}`, imageFile)

  if (uploadError) {
    console.error('Storage Upload Error:', uploadError)
    throw new Error('Failed to upload product image.')
  }

  // 2. Get the public URL for the uploaded image
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(uploadData.path)

  // 3. Insert product data into the database
  const { error: insertError } = await supabase.from('products').insert({
    salon_id: salon.id,
    name,
    description,
    price: Math.round(parseFloat(price) * 100), // Store price in cents
    stock_quantity: parseInt(stock_quantity, 10),
    image_urls: [publicUrl],
  })

  if (insertError) {
    console.error('DB Insert Error:', insertError)
    throw new Error('Failed to save product to the database.')
  }

  revalidatePath('/dashboard/products')
}

export async function deleteProduct(productId) {
  const supabase = createServerActionClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // In a real app, you'd also delete the image from storage here.
  // For simplicity, we are only deleting the DB record.

  const { error } = await supabase.from('products').delete().eq('id', productId)
  if (error) throw new Error('Failed to delete product.')

  revalidatePath('/dashboard/products')
}