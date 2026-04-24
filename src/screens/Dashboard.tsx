<div className="grid grid-cols-4 gap-4">
  {[
    { 
      name: 'DANA', 
      color: '#008FE3', 
      logo: <img src="/images/dana.png" className="w-6 h-6 object-contain" /> 
    },
    { 
      name: 'OVO', 
      color: '#4C2A86', 
      logo: <img src="/images/ovo.png" className="w-6 h-6 object-contain" /> 
    },
    { 
      name: 'LinkAja', 
      color: '#E1251B', 
      logo: <img src="/images/linkaja.png" className="w-6 h-6 object-contain" /> 
    },
    { 
      name: 'GoPay', 
      color: '#00AA13', 
      logo: <img src="/images/gopay.png" className="w-6 h-6 object-contain" /> 
    }
  ].map((wallet) => (
    <div key={wallet.name} className="flex flex-col items-center gap-2">
      
      <div 
        style={{ backgroundColor: wallet.color }}
        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
      >
        {wallet.logo}
      </div>

      <span className="text-[10px] font-bold text-gray-500">
        {wallet.name}
      </span>

    </div>
  ))}
</div>
