import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  // CORSヘッダーの処理
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // リクエストからJWTトークンを取得
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          authenticated: false, 
          message: '認証が必要です' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Supabaseクライアントの初期化
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );
    
    // ユーザーセッションの検証
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ 
          authenticated: false, 
          message: '無効なトークンです' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // ユーザープロファイル情報の取得
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // 認証成功レスポンス
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          name: profile?.name || user.email?.split('@')[0] || 'ユーザー',
          avatar_url: profile?.avatar_url,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        authenticated: false, 
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
