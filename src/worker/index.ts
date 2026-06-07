interface Env {
  DB: D1Database
  BUCKET: R2Bucket
}

export interface Journal {
  id: number
  title: string
  content: string
  date: string
  timestamp: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS 头部
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // 日志路由
    if (path === '/api/journals' && request.method === 'GET') {
      return handleGetJournals(env, corsHeaders)
    }
    if (path === '/api/journals' && request.method === 'POST') {
      return handleCreateJournal(request, env, corsHeaders)
    }
    if (path.match(/^\/api\/journals\/\d+$/) && request.method === 'DELETE') {
      const id = parseInt(path.split('/')[3])
      return handleDeleteJournal(id, env, corsHeaders)
    }

    // 头像路由
    if (path === '/api/avatar/upload' && request.method === 'POST') {
      return handleAvatarUpload(request, env, corsHeaders)
    }
    if (path === '/api/avatar' && request.method === 'GET') {
      return handleGetAvatar(env, corsHeaders)
    }

    // AI 路由
    if (path === '/api/ai/summary' && request.method === 'POST') {
      return handleAISummary(request, env, corsHeaders)
    }

    return new Response('Not Found', { status: 404 })
  },
}

async function handleGetJournals(env: Env, corsHeaders: Record<string, string>) {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM journals ORDER BY timestamp DESC'
    ).all()

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch journals' }),
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleCreateJournal(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
) {
  try {
    const { title, content } = await request.json() as { title: string; content: string }

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: 'Title and content required' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const now = new Date()
    const date = now.toLocaleDateString('zh-CN')
    const timestamp = now.toISOString()

    const { success } = await env.DB.prepare(
      'INSERT INTO journals (title, content, date, timestamp) VALUES (?, ?, ?, ?)'
    ).bind(title, content, date, timestamp).run()

    if (success) {
      return new Response(
        JSON.stringify({ success: true, message: 'Journal created' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Failed to insert')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create journal' }),
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleDeleteJournal(
  id: number,
  env: Env,
  corsHeaders: Record<string, string>
) {
  try {
    const { success } = await env.DB.prepare(
      'DELETE FROM journals WHERE id = ?'
    ).bind(id).run()

    if (success) {
      return new Response(
        JSON.stringify({ success: true, message: 'Journal deleted' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      throw new Error('Failed to delete')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete journal' }),
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleAvatarUpload(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const filename = `avatar-${Date.now()}.webp`

    // 上传到 R2
    await env.BUCKET.put(filename, arrayBuffer, {
      httpMetadata: { contentType: 'image/webp' },
    })

    // 保存到 D1（记录头像URL）
    // 本地开发时使用相对 URL，生产环境使用完整 R2 URL
    const avatarUrl = `/api/r2/${filename}`

    await env.DB.prepare(
      'UPDATE users SET avatar_url = ?, avatar_filename = ?, updated_at = datetime("now") WHERE id = 1'
    ).bind(avatarUrl, filename).run()

    return new Response(
      JSON.stringify({
        success: true,
        filename,
        url: avatarUrl,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to upload avatar', details: String(error) }),
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleGetAvatar(
  env: Env,
  corsHeaders: Record<string, string>
) {
  try {
    const result = await env.DB.prepare(
      'SELECT avatar_url FROM users WHERE id = 1'
    ).first()

    if (result && result.avatar_url) {
      return new Response(
        JSON.stringify({ success: true, avatarUrl: result.avatar_url }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      return new Response(
        JSON.stringify({ success: true, avatarUrl: null }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch avatar' }),
      { status: 500, headers: corsHeaders }
    )
  }
}

async function handleAISummary(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
) {
  try {
    const { content } = await request.json() as { content: string }

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content required' }),
        { status: 400, headers: corsHeaders }
      )
    }

    // TODO: 集成 Cloudflare Workers AI
    const summary = `摘要: ${content.substring(0, 100)}...`

    return new Response(
      JSON.stringify({ success: true, summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to generate summary' }),
      { status: 500, headers: corsHeaders }
    )
  }
}
