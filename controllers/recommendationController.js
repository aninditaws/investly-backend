const supabase = require("../db");

// Mendapatkan rekomendasi investasi berdasarkan portofolio pengguna dan profil risiko
const getInvestmentRecommendation = async (req, res) => {
  const { userId } = req.params; // Mendapatkan userId dari URL params

  try {
    // Fetch the user's risk level from the users table
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("risk_level")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return res
        .status(404)
        .json({ error: "Failed to fetch user risk level or user not found" });
    }

    const { risk_level } = user;

    // Mengambil portofolio pengguna
    const { data: portfolio, error: portfolioError } = await supabase
      .from("portfolio")
      .select("*")
      .eq("user_id", userId);

    if (portfolioError) {
      return res.status(500).json({ error: "Failed to fetch portfolio data" });
    }

    // Logika rekomendasi
    let recommendation = {
      message: "Diversify your portfolio more",
      changes: [],
    };

    // Analisis alokasi portofolio pengguna
    let totalAllocation = portfolio.reduce(
      (acc, asset) => acc + asset.allocation_percentage,
      0
    );

    // Rekomendasi berdasarkan profil risiko
    if (risk_level <= 3) {
      // Low risk tolerance
      recommendation = {
        message:
          "You have a low risk tolerance. Focus on stable investments like bonds and cash.",
        changes: [
          { asset_type: "Bonds", recommended_allocation: 60 },
          { asset_type: "Cash", recommended_allocation: 30 },
          { asset_type: "Stocks", recommended_allocation: 10 },
        ],
      };
    } else if (risk_level > 3 && risk_level <= 7) {
      // Moderate risk tolerance
      if (totalAllocation > 80) {
        recommendation = {
          message:
            "Consider diversifying your portfolio to reduce risk exposure.",
          changes: [
            { asset_type: "Stocks", recommended_allocation: 50 },
            { asset_type: "Bonds", recommended_allocation: 30 },
            { asset_type: "Cash", recommended_allocation: 20 },
          ],
        };
      } else {
        recommendation = {
          message:
            "Your portfolio seems balanced. Consider a slight adjustment to optimize returns.",
          changes: [
            { asset_type: "Stocks", recommended_allocation: 50 },
            { asset_type: "Bonds", recommended_allocation: 40 },
            { asset_type: "Cash", recommended_allocation: 10 },
          ],
        };
      }
    } else if (risk_level > 7) {
      // High risk tolerance
      recommendation = {
        message:
          "You have a high risk tolerance. Focus on growth-oriented investments like stocks.",
        changes: [
          { asset_type: "Stocks", recommended_allocation: 70 },
          { asset_type: "Bonds", recommended_allocation: 20 },
          { asset_type: "Cash", recommended_allocation: 10 },
        ],
      };
    }

    // Kirimkan rekomendasi ke pengguna
    res.status(200).json(recommendation);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

module.exports = {
  getInvestmentRecommendation,
};
