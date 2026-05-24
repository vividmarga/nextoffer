# NextOffer — n8n Automation Flows
# Import these JSON configs into your n8n instance

# ─────────────────────────────────────────────────────────────────
# FLOW 1: Daily Deal Sync (Awin API → Supabase)
# Trigger: Every day at 3:00 AM
# ─────────────────────────────────────────────────────────────────

FLOW_1_DEAL_SYNC = """
{
  "name": "Daily Awin Deal Sync",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": { "interval": [{ "field": "hours", "hoursInterval": 24 }] }
      }
    },
    {
      "name": "Fetch Awin Transactions",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.awin.com/publishers/{{AWIN_PUBLISHER_ID}}/transactions/",
        "authentication": "headerAuth",
        "headers": {
          "Authorization": "Bearer {{AWIN_API_TOKEN}}"
        },
        "queryParameters": {
          "startDate": "={{$today.minus({days:1}).toISO()}}",
          "endDate":   "={{$today.toISO()}}"
        }
      }
    },
    {
      "name": "Process Transactions",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "return items.map(item => ({ json: { ...item.json, synced_at: new Date().toISOString() } }));"
      }
    },
    {
      "name": "Upsert to Supabase",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{SUPABASE_URL}}/rest/v1/affiliate_clicks",
        "method": "POST",
        "authentication": "headerAuth",
        "headers": {
          "apikey": "{{SUPABASE_SERVICE_KEY}}",
          "Authorization": "Bearer {{SUPABASE_SERVICE_KEY}}",
          "Prefer": "resolution=merge-duplicates"
        },
        "body": "={{ JSON.stringify($json) }}"
      }
    },
    {
      "name": "Ping Sitemap to Google",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://www.google.com/ping?sitemap=https://nextoffer.co.uk/sitemap.xml",
        "method": "GET"
      }
    },
    {
      "name": "Notify Slack",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "text": "✅ Deal sync complete: {{$json.count}} transactions processed"
      }
    }
  ]
}
"""

# ─────────────────────────────────────────────────────────────────
# FLOW 2: New Deal Alert → Email + Slack
# Trigger: Webhook from Supabase (on INSERT to deals table)
# ─────────────────────────────────────────────────────────────────

FLOW_2_NEW_DEAL_ALERT = """
{
  "name": "New Deal Alert",
  "nodes": [
    {
      "name": "Supabase Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "new-deal",
        "authentication": "headerAuth",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Validate Deal",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [{ "value1": "={{$json.is_active}}", "value2": "true" }]
        }
      }
    },
    {
      "name": "Revalidate ISR Page",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://nextoffer.co.uk/api/revalidate",
        "method": "POST",
        "headers": { "x-revalidate-token": "{{CRON_SECRET}}" },
        "body": "={{ JSON.stringify({ path: '/' + $json.vertical }) }}"
      }
    },
    {
      "name": "IndexNow — Bing",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.indexnow.org/indexnow",
        "method": "POST",
        "body": "={{ JSON.stringify({ host: 'nextoffer.co.uk', key: $env.INDEXNOW_KEY, urlList: ['https://nextoffer.co.uk/deals/' + $json.slug] }) }}"
      }
    },
    {
      "name": "Send Slack Notification",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "text": "🔥 New deal live: *{{$json.title}}* — £{{$json.price}}/mo via {{$json.affiliate_network}}"
      }
    }
  ]
}
"""

# ─────────────────────────────────────────────────────────────────
# FLOW 3: Weekly Performance Report
# Trigger: Every Monday 8:00 AM
# ─────────────────────────────────────────────────────────────────

FLOW_3_WEEKLY_REPORT = """
{
  "name": "Weekly Performance Report",
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": { "interval": [{ "field": "weeks", "weeksInterval": 1 }] }
      }
    },
    {
      "name": "Fetch Click Stats",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{SUPABASE_URL}}/rest/v1/rpc/weekly_stats",
        "headers": { "apikey": "{{SUPABASE_SERVICE_KEY}}" }
      }
    },
    {
      "name": "Fetch Awin Earnings",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.awin.com/publishers/{{AWIN_PUBLISHER_ID}}/transactions/?startDate={{$today.minus({days:7}).toISO()}}&endDate={{$today.toISO()}}"
      }
    },
    {
      "name": "Generate Report",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const clicks = $('Fetch Click Stats').first().json; const earnings = $('Fetch Awin Earnings').first().json; return [{ json: { totalClicks: clicks.total_clicks, topDeal: clicks.top_deal, estimatedEarnings: earnings.total || 0, report_date: new Date().toISOString() } }];"
      }
    },
    {
      "name": "Send Email Report",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "{{YOUR_EMAIL}}",
        "subject": "📊 NextOffer Weekly Report — w/c {{$today.minus({days:7}).toFormat('dd MMM')}}",
        "text": "Clicks this week: {{$json.totalClicks}}\\nTop deal: {{$json.topDeal}}\\nEstimated earnings: £{{$json.estimatedEarnings}}"
      }
    }
  ]
}
"""

# ─────────────────────────────────────────────────────────────────
# FLOW 4: Programmatic Page Generator
# Trigger: Manual or weekly schedule
# Creates comparison pages automatically
# ─────────────────────────────────────────────────────────────────

FLOW_4_PROG_SEO = """
{
  "name": "Generate Comparison Pages",
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger"
    },
    {
      "name": "Fetch All Providers",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{SUPABASE_URL}}/rest/v1/providers?select=id,name,slug,vertical&is_active=eq.true",
        "headers": { "apikey": "{{SUPABASE_SERVICE_KEY}}" }
      }
    },
    {
      "name": "Generate Pairs",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const providers = $input.all().map(i => i.json); const pairs = []; for(let i=0;i<providers.length;i++){for(let j=i+1;j<providers.length;j++){if(providers[i].vertical===providers[j].vertical){const slugA=providers[i].name.toLowerCase().replace(/\\s+/g,'-'); const slugB=providers[j].name.toLowerCase().replace(/\\s+/g,'-'); const pair=[slugA,slugB].sort(); pairs.push({json:{slug:pair.join('-vs-'),providerA:providers[i].slug,providerB:providers[j].slug,vertical:providers[i].vertical}});}}} return pairs;"
      }
    },
    {
      "name": "Upsert Comparisons",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "{{SUPABASE_URL}}/rest/v1/comparisons",
        "method": "POST",
        "headers": {
          "apikey": "{{SUPABASE_SERVICE_KEY}}",
          "Prefer": "resolution=ignore-duplicates"
        },
        "body": "={{ JSON.stringify($json) }}"
      }
    }
  ]
}
"""

# ─────────────────────────────────────────────────────────────────
# FLOW 5: Make.com — Awin → Google Sheets (backup tracking)
# ─────────────────────────────────────────────────────────────────

MAKE_FLOW_TRACKING = """
Modules:
1. Schedule → Every 6 hours
2. HTTP Request → GET https://api.awin.com/publishers/{id}/transactions/
   Headers: Authorization: Bearer {token}
3. Iterator → Loop through transactions
4. Google Sheets → Append row:
   [date, provider, commission, status, click_ref]
5. Filter → Only new transactions (not already in sheet)
6. Slack → Alert if commission > £50
"""

# ─────────────────────────────────────────────────────────────────
# Supabase Edge Function: Revalidate ISR
# ─────────────────────────────────────────────────────────────────

SUPABASE_REVALIDATE_FUNCTION = """
-- Deploy as Supabase Edge Function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { path } = await req.json()
  const secret = Deno.env.get('NEXT_REVALIDATE_SECRET')
  
  const response = await fetch(`https://nextoffer.co.uk/api/revalidate?secret=${secret}&path=${path}`, {
    method: 'POST'
  })
  
  return new Response(JSON.stringify({ revalidated: true, path }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
"""
