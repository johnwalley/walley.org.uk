import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const title =
    request.nextUrl.searchParams.get('title') ??
    'Software engineer, data visualisation specialist, and amateur coxswain.'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          backgroundColor: '#18181b',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #27272a 0%, #18181b 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: title.length > 60 ? 56 : 68,
            fontWeight: 700,
            color: '#fafafa',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            maxWidth: '1000px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '12px',
              height: '48px',
              borderRadius: '6px',
              backgroundColor: '#14b8a6',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ fontSize: 32, fontWeight: 700, color: '#fafafa' }}>
              John Walley
            </div>
            <div style={{ fontSize: 24, color: '#a1a1aa' }}>walley.org.uk</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
