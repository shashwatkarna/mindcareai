import { ImageResponse } from 'next/og'

export const alt = 'MindCare AI - AI Mental Health & Wellness Tracker'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0A0118',
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(139, 92, 246, 0.15) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(236, 72, 153, 0.15) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '60px',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5)',
                        maxWidth: '1000px',
                    }}
                >
                    {/* Logo / Brand Name */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                        <div
                            style={{
                                width: '60px',
                                height: '60px',
                                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '20px',
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                                <path d="M12 3a9 9 0 0 0 9 9H3a9 9 0 0 0 9-9Z" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', letterSpacing: '-0.02em' }}>
                            MindCare AI
                        </span>
                    </div>

                    {/* Clear Headline */}
                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: '900',
                            color: 'white',
                            textAlign: 'center',
                            lineHeight: 1.1,
                            marginBottom: '20px',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        Your Private AI Mental <br />
                        <span style={{ color: '#F472B6' }}>Health & Wellness Tracker</span>
                    </h1>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#9CA3AF',
                            textAlign: 'center',
                            marginBottom: '40px',
                            maxWidth: '800px',
                        }}
                    >
                        Secure mood tracking, private journaling, and clinical-grade AI insights.
                        Built to help you find your inner balance.
                    </p>

                    {/* Call to Action */}
                    <div
                        style={{
                            background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                            padding: '16px 40px',
                            borderRadius: '9999px',
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Start Your Free Wellness Journey
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
