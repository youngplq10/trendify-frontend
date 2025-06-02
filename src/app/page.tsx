import React, { Suspense } from 'react';
import Navbar from './modules/Navbar';
import SearchWrapper from './components/SearchWrapper';

export default function Home() {
  return (
    <section className="container-lg">
      <nav className="row">
        <Navbar />
      </nav>
      <section className="row justify-content-center">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchWrapper />
        </Suspense>
      </section>
    </section>
  );
}
