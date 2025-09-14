import { supabase } from '../../../lib/supabase'

// GET /api/keys - Fetch all API keys
export async function GET() {
  try {
    console.log('Fetching API keys from Supabase...')
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching API keys:', error)
      return Response.json(
        { error: 'Failed to fetch API keys', details: error.message },
        { status: 500 }
      )
    }

    console.log('Successfully fetched API keys:', data?.length || 0)
    return Response.json(data || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/keys - Create a new API key
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, key, description, environment } = body

    console.log('Creating new API key:', { name, key, environment })

    if (!name || !key) {
      return Response.json(
        { error: 'Name and key are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          key,
          description: description || '',
          environment: environment || 'development'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating API key:', error)
      if (error.code === '23505') { // Unique constraint violation
        return Response.json(
          { error: 'API key already exists' },
          { status: 409 }
        )
      }
      return Response.json(
        { error: 'Failed to create API key', details: error.message },
        { status: 500 }
      )
    }

    console.log('Successfully created API key:', data.id)
    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return Response.json(
      { error: 'Invalid request body', details: error.message },
      { status: 400 }
    )
  }
}
