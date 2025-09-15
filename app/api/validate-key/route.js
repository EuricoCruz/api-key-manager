import { supabase } from '../../../lib/supabase'

// POST /api/validate-key - Validate an API key
export async function POST(request) {
  try {
    const body = await request.json()
    const { key } = body

    if (!key) {
      return Response.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    console.log('Validating API key...')

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, environment')
      .eq('key', key)
      .single()

    if (error) {
      console.log('API key validation failed:', error.message)
      return Response.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    if (!data) {
      console.log('API key not found')
      return Response.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    console.log('API key validated successfully:', data.name)
    return Response.json({
      valid: true,
      keyInfo: {
        id: data.id,
        name: data.name,
        environment: data.environment
      }
    })
  } catch (error) {
    console.error('Unexpected error during validation:', error)
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
