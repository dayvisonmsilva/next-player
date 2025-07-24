import { Poppins } from 'next/font/google';
import './globals.css';

// Otimização: Configura a fonte Poppins usando o sistema do Next.js
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'], 
  display: 'swap', 
});

export const metadata = {
  title: 'React Video Player',
  description: 'Um player de vídeo interativo construído com Next.js e React.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}