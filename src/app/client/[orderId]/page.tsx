import AppLogo from '@/components/app-logo';
import ClientPortalContent from '@/components/client-portal-content';
import { getOrders } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ClientPortalLoading from './loading';

export default async function ClientPortalPage({ params }: { params: { orderId: string } }) {
  const allOrders = await getOrders();
  const order = allOrders.find(o => o.id === params.orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/40">
       <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b bg-background/95 px-4 backdrop-blur sm:h-16 sm:px-6">
        <AppLogo />
      </header>
      <main className="container mx-auto max-w-4xl py-8 px-4">
        <Suspense fallback={<ClientPortalLoading />}>
            <ClientPortalContent order={order} />
        </Suspense>
      </main>
      <footer className="mt-8 py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Couturier Numérique. Un suivi transparent pour vos créations.</p>
      </footer>
    </div>
  );
}
