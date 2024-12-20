const supabase = require("../db"); // Supabase client

// Add a new portfolio entry
const addPortfolio = async (req, res) => {
  const {
    userId,
    assetType,
    sector,
    allocationPercentage,
    targetAllocationPercentage,
    value,
    riskLevel,
  } = req.body;

  const { data, error } = await supabase.from("portfolio").insert([
    {
      user_id: userId,
      asset_type: assetType,
      sector: sector,
      allocation_percentage: allocationPercentage,
      target_allocation_percentage: targetAllocationPercentage,
      value: value,
      risk_level: riskLevel,
      last_updated: new Date(),
    },
  ]);

  if (error) {
    console.error("Error adding portfolio:", error);
    return res.status(500).json({ error: "Failed to add portfolio" });
  }

  console.log("Portfolio added:", data);
  return res.status(201).json(data);
};

// Fetch portfolio by userId
const getPortfolio = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching portfolio:", error);
    return res.status(500).json({ error: "Failed to fetch portfolio" });
  }

  return res.status(200).json(data);
};

// Generate portfolio recommendations
const getInvestmentRecommendation = async (req, res) => {
  const { userId } = req.params;

  // Fetch user's portfolio
  const { data: portfolio, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(500).json({ error: "Failed to fetch portfolio data" });
  }

  // Recommendation logic
  const recommendations = [];
  let totalAllocation = portfolio.reduce(
    (acc, asset) => acc + asset.allocation_percentage,
    0
  );

  portfolio.forEach((asset) => {
    if (asset.allocation_percentage > asset.target_allocation_percentage) {
      recommendations.push({
        message: `Reduce allocation in ${asset.asset_type} (${asset.sector}). Current: ${asset.allocation_percentage}%, Target: ${asset.target_allocation_percentage}%`,
      });
    } else if (
      asset.allocation_percentage < asset.target_allocation_percentage
    ) {
      recommendations.push({
        message: `Increase allocation in ${asset.asset_type} (${asset.sector}). Current: ${asset.allocation_percentage}%, Target: ${asset.target_allocation_percentage}%`,
      });
    }
  });

  const overallRecommendation =
    totalAllocation > 100
      ? "Your total allocation exceeds 100%. Please rebalance your portfolio."
      : "Your total allocation is within limits.";

  res.status(200).json({
    overallRecommendation,
    recommendations,
  });
};

module.exports = {
  addPortfolio,
  getPortfolio,
  getInvestmentRecommendation,
};
