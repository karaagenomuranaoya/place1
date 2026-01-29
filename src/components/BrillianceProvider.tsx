"use client";

import { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";

// グローバルな状態として管理
type BrillianceContextType = {
  brilliance: number; // 0〜100
  setBrilliance: (value: number) => void;
};

const BrillianceContext = createContext<BrillianceContextType | undefined>(undefined);

export function BrillianceProvider({ children }: { children: React.ReactNode }) {
  // 初期値は100（フルカラー）
  const [brilliance, setBrilliance] = useState(100);

  // 輝きに応じたグレースケール率 (輝きが減るほどグレーになる)
  const grayscaleAmount = 100 - brilliance;
  
  // 輝きが低いときの画面の揺らぎ（禁断症状の演出）
  const isCritical = brilliance < 20;

  return (
    <BrillianceContext.Provider value={{ brilliance, setBrilliance }}>
      <div className="relative min-h-screen bg-white">
        {/* コンテンツ本体 */}
        <div className="relative z-10">{children}</div>

        {/* フィルターレイヤー: 輝きが100未満（色が欠け始めた）ときだけ表示 */}
        {grayscaleAmount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              // mix-blend-saturation を削除し、純粋なフィルターのみにしました
              backdropFilter: `grayscale(${grayscaleAmount}%) contrast(${
                100 - grayscaleAmount * 0.2
              }%)`,
            }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none fixed inset-0 z-50"
            style={{
              // 少しだけ画面を暗くする演出
              backgroundColor: `rgba(100, 100, 100, ${grayscaleAmount * 0.005})`,
            }}
          />
        )}

        {/* 危険域（輝度20以下）のエフェクト: ノイズ演出 */}
        {isCritical && (
          <div className="pointer-events-none fixed inset-0 z-50 opacity-10 bg-black" />
        )}
      </div>
    </BrillianceContext.Provider>
  );
}

export const useBrilliance = () => {
  const context = useContext(BrillianceContext);
  if (!context) throw new Error("useBrilliance must be used within a BrillianceProvider");
  return context;
};