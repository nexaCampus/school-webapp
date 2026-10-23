import type { Metadata, Viewport } from 'next';
import { Poppins, Merriweather } from 'next/font/google';
import BootSplash from '@/components/BootSplash';
import PWARegistration from '@/components/PWARegistration';
import CookieConsentBanner from '@/components/CookieConsentBanner';
import QueryProvider from '@/components/QueryProvider';
import ErrorBoundary from '@/components/feedback/ErrorBoundary';
import { TenantProvider } from '@/lib/context/TenantContext';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NexaCampus | Autonomous Multi-Tenant School Operating System',
    template: '%s | NexaCampus',
  },
  description: 'Autonomous multi-tenant academic cloud operating system providing unified institutional governance, student portals, biometric attendance, bus telemetry, and examinations.',
  applicationName: 'NexaCampus',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NexaCampus',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1c2ac8' },
    { media: '(prefers-color-scheme: dark)', color: '#12131a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${merriweather.variable} ${poppins.className}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NexaCampus" />
        <meta name="theme-color" content="#1c2ac8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        {/*
          Poppins and Merriweather are already self-hosted through next/font,
          so only the optional display face and the icon ligature set are
          pulled from Google. They are injected asynchronously so a slow font
          CDN can never delay the first paint.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var f=['https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&display=swap','https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_balance,account_balance_wallet,account_circle,add_business,add_card,add_circle,add_shopping_cart,admin_panel_settings,apartment,apparel,apps,architecture,arrow_back,arrow_downward,arrow_forward,arrow_forward_ios,assessment,assignment,assignment_turned_in,attach_file,auto_awesome,auto_read_pause,auto_stories,backpack,badge,balance,beach_access,biotech,bloodtype,bolt,build,build_circle,cake,calculate,calendar_month,calendar_today,call,campaign,category,celebration,check,check_circle,checklist,checkroom,chevron_left,chevron_right,close,cloud_done,cloud_sync,code,confirmation_number,contact_support,contactless,cookie,credit_card,currency_exchange,dark_mode,dashboard,data_object,database,delete_forever,description,developer_mode,directions_bus,dns,domain,done_all,download,download_for_offline,eco,edit_note,emoji_events,error,event,event_available,event_note,expand_more,explore_off,face_3,fact_check,family_restroom,file_download,fitness_center,flight,folder_special,forum,function,functions,gavel,grid_view,groups,groups_2,handshake,history_edu,home,how_to_reg,info,key,keyboard_arrow_down,labs,laptop_chromebook,light_mode,lightbulb,link,local_cafe,local_fire_department,local_hospital,local_library,location_on,lock,lock_reset,login,logout,lunch_dining,mail,mark_chat_unread,mark_email_read,medical_services,meeting_room,menu,menu_book,military_tech,music_note,notifications,notifications_active,palette,payments,person,person_remove,phone_iphone,photo_library,picture_as_pdf,pin_drop,place,policy,priority_high,production_quantity_limits,progress_activity,psychology,qr_code_2,receipt,receipt_long,restaurant,satellite_alt,save,schedule,schema,school,science,search,search_check,security,send,shield,shopping_bag,shopping_cart,smart_toy,sms,speed,sports_soccer,star,stars,sticky_note_2,storefront,straighten,styler,support_agent,swap_horiz,switch_account,sync_alt,sync_problem,table_chart,tag,terminal,title,travel_explore,trending_flat,trending_up,tune,upload_file,verified,verified_user,videocam,visibility,volume_up,volunteer_activism,wallet,warning,watch,widgets,workspace_premium&display=swap'];for(var i=0;i<f.length;i++){var l=document.createElement('link');l.rel='stylesheet';l.href=f[i];l.media='print';l.onload=function(){this.media='all'};document.head.appendChild(l);}})();`,
          }}
        />
      </head>
      <body className={`${poppins.className} font-sans antialiased bg-surface text-on-surface`}>
        <QueryProvider>
          <ErrorBoundary>
            <TenantProvider>
              <BootSplash>
                {children}
                <PWARegistration />
                <CookieConsentBanner />
              </BootSplash>
            </TenantProvider>
          </ErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
