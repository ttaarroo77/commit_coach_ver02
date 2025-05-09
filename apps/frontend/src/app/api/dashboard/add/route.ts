import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
   process.env.NEXT_PUBLIC_SUPABASE_URL!,
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: Request) {
   try {
      const { type, id } = await request.json()

      if (!type || !id) {
         return NextResponse.json(
            { error: 'Type and ID are required' },
            { status: 400 }
         )
      }

      const { data: user } = await supabase.auth.getUser()
      if (!user) {
         return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
         )
      }

      const { data, error } = await supabase
         .from('dashboard_items')
         .insert([
            {
               user_id: user.user.id,
               type,
               item_id: id,
               position: 0,
            }
         ])
         .select()

      if (error) {
         console.error('Error adding to dashboard:', error)
         return NextResponse.json(
            { error: 'Failed to add to dashboard' },
            { status: 500 }
         )
      }

      return NextResponse.json(data[0])
   } catch (error) {
      console.error('Error in dashboard add route:', error)
      return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
      )
   }
} 