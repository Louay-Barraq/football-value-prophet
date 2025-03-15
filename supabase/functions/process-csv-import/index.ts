
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { parse } from "https://deno.land/std@0.168.0/csv/parse.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Parse request body
    const { filename, userId } = await req.json();
    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'Filename is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Processing CSV file: ${filename} for user: ${userId}`);
    
    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('csv-imports')
      .download(filename);
      
    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return new Response(
        JSON.stringify({ error: `Failed to download file: ${downloadError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse CSV content
    const csvText = await fileData.text();
    const records = parse(csvText, { skipFirstRow: true, columns: true });
    
    console.log(`Parsed ${records.length} records from CSV`);
    
    let processedCount = 0;
    
    // Process each player record
    for (const record of records) {
      try {
        // Map CSV columns to database columns
        // (assuming your CSV has columns that might not exactly match the database)
        const playerData = {
          name: record.name,
          age: parseInt(record.age, 10),
          position: record.position,
          club: record.club,
          club_logo: record.club_logo || null,
          nationality: record.nationality,
          nationality_flag: record.nationality_flag || null,
          market_value: parseInt(record.market_value, 10),
          image_url: record.image_url || null,
        };
        
        // Insert player data
        const { data: player, error: playerError } = await supabase
          .from('players')
          .upsert([playerData], { onConflict: 'name' }) // assumes name is unique; adjust as needed
          .select('id')
          .single();
          
        if (playerError) {
          console.error('Error inserting player:', playerError);
          continue;
        }
        
        // If we have statistics, insert those too
        if (record.goals || record.assists || record.appearances) {
          const statsData = {
            player_id: player.id,
            season: record.season || 'current',
            goals: parseInt(record.goals, 10) || 0,
            assists: parseInt(record.assists, 10) || 0,
            appearances: parseInt(record.appearances, 10) || 0,
            minutes_played: parseInt(record.minutes_played, 10) || 0,
            pass_accuracy: parseFloat(record.pass_accuracy) || null,
            tackles: parseInt(record.tackles, 10) || 0,
            interceptions: parseInt(record.interceptions, 10) || 0,
          };
          
          const { error: statsError } = await supabase
            .from('player_statistics')
            .upsert([statsData], { onConflict: 'player_id,season' });
            
          if (statsError) {
            console.error('Error inserting statistics:', statsError);
          }
        }
        
        processedCount++;
      } catch (err) {
        console.error('Error processing record:', err);
      }
    }
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        processedCount,
        message: `Successfully processed ${processedCount} of ${records.length} players` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
