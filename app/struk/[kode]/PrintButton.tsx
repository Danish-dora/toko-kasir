"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-1 bg-[#6B8CAE] text-white rounded-lg py-2 font-semibold"
    >
      Cetak Struk
    </button>
  );
}