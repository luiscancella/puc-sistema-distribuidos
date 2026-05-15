export const Colors = {
    bg:        '#FBF7EE',
    surface:   '#FFFFFF',
    surface2:  '#F4EFE3',
    ink:       '#1F1A2E',
    ink2:      '#5C5470',
    ink3:      '#9590A8',
    hair:      '#EDE6D6',
    peach:     '#FF8A6B',
    peachSoft: '#FFE2D6',
    mint:      '#9BD6B5',
    mintSoft:  '#D9F0E2',
} as const;

export const Radius = {
    tile:  14,
    photo: 20,
    card:  24,
    sheet: 28,
    pill:  9999,
} as const;

export const Shadow = {
    e1: {
        shadowColor:  '#1F1A2E',
        shadowOpacity: 0.04,
        shadowRadius:  18,
        shadowOffset:  { width: 0, height: 6 },
        elevation: 2,
    },
    e2: {
        shadowColor:  '#1F1A2E',
        shadowOpacity: 0.10,
        shadowRadius:  28,
        shadowOffset:  { width: 0, height: 8 },
        elevation: 4,
    },
} as const;

export const FontFamily = {
    display:  'BricolageGrotesque_700Bold',
    body:     'HankenGrotesk_500Medium',
    bodyBold: 'HankenGrotesk_800ExtraBold',
} as const;
