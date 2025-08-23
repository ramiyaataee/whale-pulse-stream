import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Standard UI Colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				
				// Trading-Specific Colors
				trading: {
					background: 'hsl(var(--trading-background))',
					foreground: 'hsl(var(--trading-foreground))',
					card: 'hsl(var(--trading-card))',
					'card-foreground': 'hsl(var(--trading-card-foreground))'
				},
				bull: {
					DEFAULT: 'hsl(var(--bull))',
					foreground: 'hsl(var(--bull-foreground))'
				},
				bear: {
					DEFAULT: 'hsl(var(--bear))',
					foreground: 'hsl(var(--bear-foreground))'
				},
				whale: {
					DEFAULT: 'hsl(var(--whale))',
					foreground: 'hsl(var(--whale-foreground))'
				},
				chart: {
					grid: 'hsl(var(--chart-grid))',
					support: 'hsl(var(--chart-support))',
					resistance: 'hsl(var(--chart-resistance))',
					ema50: 'hsl(var(--chart-ema50))',
					ema100: 'hsl(var(--chart-ema100))',
					ema200: 'hsl(var(--chart-ema200))'
				},
				confidence: {
					high: 'hsl(var(--confidence-high))',
					medium: 'hsl(var(--confidence-medium))',
					low: 'hsl(var(--confidence-low))'
				},
				volume: {
					high: 'hsl(var(--volume-high))',
					medium: 'hsl(var(--volume-medium))',
					low: 'hsl(var(--volume-low))'
				}
			},
			backgroundImage: {
				'gradient-bull': 'var(--gradient-bull)',
				'gradient-bear': 'var(--gradient-bear)',
				'gradient-whale': 'var(--gradient-whale)',
				'gradient-chart': 'var(--gradient-chart)'
			},
			boxShadow: {
				'trading': 'var(--shadow-trading)',
				'glow': 'var(--shadow-glow)',
				'bull': 'var(--shadow-bull)',
				'bear': 'var(--shadow-bear)'
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'fast': 'var(--transition-fast)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
