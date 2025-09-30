"use client";
import React, { useState } from "react";

interface BrandInfo {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  font: string;
}

interface ThemeGeneratorProps {
  authToken: string;
}

const ThemeGenerator: React.FC<ThemeGeneratorProps> = ({ authToken }) => {
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({
    name: "Instyle Hair Boutique",
    colors: {
      primary: "#D946EF",
      secondary: "#FDF4FF",
      accent: "#A855F7",
      text: "#1F2937",
    },
    font: "Poppins",
  });
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch("/api/generate-component", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        componentType: "theme",
        brandInfo,
      }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: brandInfo.font }}>
      <h2>Theme Generator</h2>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Theme Component"}
      </button>
      {result && (
        <pre style={{ marginTop: 16, background: brandInfo.colors.secondary, color: brandInfo.colors.text }}>
          {result}
        </pre>
      )}
    </div>
  );
};

export default ThemeGenerator;
