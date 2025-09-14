import { supabase } from '../../../../lib/supabase'

// GET /api/keys/[id] - Fetch a specific API key
export async function GET(request, { params }) {
  try {
    const { id } = params
    console.log('Fetching API key with ID:', id)
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching API key:', error)
      return Response.json(
        { error: 'API key not found', details: error.message },
        { status: 404 }
      )
    }

    console.log('Successfully fetched API key:', data.id)
    return Response.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/keys/[id] - Update a specific API key
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, key, description, environment } = body

    console.log('Updating API key:', { id, name, key, environment })

    if (!name || !key) {
      return Response.json(
        { error: 'Name and key are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('api_keys')
      .update({
        name,
        key,
        description: description || '',
        environment: environment || 'development'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating API key:', error)
      if (error.code === '23505') { // Unique constraint violation
        return Response.json(
          { error: 'API key already exists' },
          { status: 409 }
        )
      }
      return Response.json(
        { error: 'API key not found', details: error.message },
        { status: 404 }
      )
    }

    console.log('Successfully updated API key:', data.id)
    return Response.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json(
      { error: 'Invalid request body', details: error.message },
      { status: 400 }
    )
  }
}

// DELETE /api/keys/[id] - Delete a specific API key
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    console.log('Deleting API key with ID:', id)
    
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting API key:', error)
      return Response.json(
        { error: 'API key not found', details: error.message },
        { status: 404 }
      )
    }

    console.log('Successfully deleted API key:', id)
    return Response.json(
      { message: 'API key deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

