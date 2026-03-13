import React from 'react';

const SecretaireHome = () => {
  return (
    <div className="p-10">
      <div className="bg-[#cbff00] p-20 rounded-[3rem] text-center border-4 border-white shadow-[0_0_50px_rgba(203,255,0,0.3)]">
        <h1 className="text-6xl font-black text-black italic uppercase tracking-tighter mb-4">
          ACCÈS RÉUSSI !
        </h1>
        <p className="text-black font-bold uppercase tracking-[0.3em] text-sm">
          Le Dashboard Secrétaire / Admin est opérationnel.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <span className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase">
            Rôle Détecté : OK
          </span>
          <span className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase border border-black/10">
            Composant : SecretaireHome.jsx
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecretaireHome;