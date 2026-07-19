import { supabase } from '../lib/supabase'

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export async function createCategory({ name, slug, image }) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, slug, image })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function fetchBales({
  category,
  grade,
  available,
  search,
  sort,
  page = 1,
  perPage = 6,
} = {}) {
  let query = supabase
    .from('bales')
    .select(
      '*, category:categories(id,name,slug), images:bale_images(id,image_url,sort_order)',
      { count: 'exact' }
    )

  if (category) query = query.eq('category_id', category)
  if (grade) query = query.eq('grade', grade)

  if (available === true) query = query.eq('available', true)
  if (available === false) query = query.eq('available', false)

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,description.ilike.%${search}%`
    )
  }

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break

    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break

    case 'price-low':
      query = query.order('price', { ascending: true })
      break

    case 'price-high':
      query = query.order('price', { ascending: false })
      break

    case 'featured':
      query = query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
      break

    default:
      query = query.order('created_at', { ascending: false })
  }

  const from = (page - 1) * perPage
  const to = from + perPage - 1

  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  return {
    bales: data,
    totalCount: count,
  }
}

export async function fetchBaleBySlug(slug) {
  const { data, error } = await supabase
    .from('bales')
    .select(
      '*, category:categories(id,name,slug), images:bale_images(id,image_url,sort_order)'
    )
    .eq('slug', slug)
    .single()

  if (error) throw error

  return data
}

export async function fetchRelatedBales(categoryId, excludeId) {
  const { data, error } = await supabase
    .from('bales')
    .select('*, images:bale_images(id,image_url,sort_order)')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) throw error

  return data
}

export async function fetchFeaturedBales() {
  const { data, error } = await supabase
    .from('bales')
    .select(
      '*, category:categories(id,name,slug), images:bale_images(id,image_url,sort_order)'
    )
    .eq('featured', true)
    .eq('available', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error

  return data
}

export async function createBale(baleData, imageUrls = []) {
  const { data: bale, error } = await supabase
    .from('bales')
    .insert({
      category_id: baleData.category_id,
      name: baleData.name,
      slug: baleData.slug,
      description: baleData.description,
      price: Number(baleData.price),
      grade: baleData.grade,
      estimated_pieces: Number(baleData.estimated_pieces),
      country_of_origin: baleData.country_of_origin,
      featured: Boolean(baleData.featured),
      available: Boolean(baleData.available),
    })
    .select()
    .single()

  if (error) throw error

  if (imageUrls.length) {
    const images = imageUrls.map((url, index) => ({
      bale_id: bale.id,
      image_url: url,
      sort_order: index,
    }))

    const { error: imgError } = await supabase
      .from('bale_images')
      .insert(images)

    if (imgError) throw imgError
  }

  return bale
}

export async function updateBale(
  id,
  baleData,
  newImageUrls = [],
  removedImageIds = []
) {
  const { data, error } = await supabase
    .from('bales')
    .update({
      category_id: baleData.category_id,
      name: baleData.name,
      slug: baleData.slug,
      description: baleData.description,
      price: Number(baleData.price),
      grade: baleData.grade,
      estimated_pieces: Number(baleData.estimated_pieces),
      country_of_origin: baleData.country_of_origin,
      featured: Boolean(baleData.featured),
      available: Boolean(baleData.available),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  if (removedImageIds.length) {
    await supabase
      .from('bale_images')
      .delete()
      .in('id', removedImageIds)
  }

  if (newImageUrls.length) {
    const { data: existing } = await supabase
      .from('bale_images')
      .select('sort_order')
      .eq('bale_id', id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = existing?.[0]?.sort_order + 1 || 0

    const images = newImageUrls.map((url, index) => ({
      bale_id: id,
      image_url: url,
      sort_order: nextOrder + index,
    }))

    await supabase.from('bale_images').insert(images)
  }

  return data
}

export async function deleteBale(id) {
  const { error } = await supabase
    .from('bales')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleBaleAvailability(id) {
  const { data: current, error: fetchError } = await supabase
    .from('bales')
    .select('available')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const { data, error } = await supabase
    .from('bales')
    .update({
      available: !current.available,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}