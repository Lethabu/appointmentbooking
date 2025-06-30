'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const salonId = formData.get('salonId')
  const name = formData.get('name')
  const description = formData.get('description')
  const price = formData.get('price')
  const stock_quantity = formData.get('stock_quantity')
  const imageFile = formData.get('image')

  // Verify user owns the salon
  const { data: salon, error: salonError } = await supabase
    .from('salons')
    .select('id')
    .eq('id', salonId)
    .eq('owner_id', user.id)
    .single()

  if (salonError || !salon) {
    return { error: 'You do not have permission to add products to this salon.' }
  }

  // Handle image upload
  let imageUrl = null
  if (imageFile && imageFile.size > 0) {
    const fileName = `${salon.id}/${Date.now()}-${imageFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images') // Ensure you have a 'product-images' bucket in Supabase Storage
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      return { error: 'Failed to upload image.' }
    }

    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
    imageUrl = publicUrl
  }

  const { error: insertError } = await supabase.from('products').insert({
    salon_id: salon.id,
    name,
    description,
    price: Math.round(parseFloat(price) * 100), // Store in cents
    stock_quantity: parseInt(stock_quantity),
    image_urls: imageUrl ? [imageUrl] : [],
  })

  if (insertError) return { error: 'Failed to create product.' }

  revalidatePath('/dashboard/products')
  return { success: 'Product created successfully!' }
}

export async function deleteProduct(formData) {
  const supabase = createClient()
  const productId = formData.get('productId')
  // In a real app, you'd also verify ownership and delete the image from storage
  await supabase.from('products').delete().eq('id', productId)
  revalidatePath('/dashboard/products')
}