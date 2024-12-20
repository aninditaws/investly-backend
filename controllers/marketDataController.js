const supabase = require("../db");

// Get all market data
const getMarketData = async (req, res) => {
  const { data, error } = await supabase.from("market_data").select("*");
  if (error) {
    console.error("Error fetching market data:", error);
    return res.status(500).json({ error: "Failed to fetch market data" });
  }
  res.status(200).json(data);
};

// Add new market data
const addMarketData = async (req, res) => {
  const {
    tickerSymbol,
    price,
    volume,
    date,
    volatility,
    sector,
    averageReturn,
  } = req.body;

  const { data, error } = await supabase.from("market_data").insert([
    {
      ticker_symbol: tickerSymbol,
      price,
      volume,
      date,
      volatility,
      sector,
      average_return: averageReturn,
    },
  ]);

  if (error) {
    console.error("Error adding market data:", error);
    return res.status(500).json({ error: "Failed to add market data" });
  }

  res.status(201).json(data);
};

// Get market data by sector
const getMarketDataBySector = async (req, res) => {
  const { sector } = req.params;

  const { data, error } = await supabase
    .from("market_data")
    .select("*")
    .eq("sector", sector);

  if (error) {
    console.error("Error fetching market data by sector:", error);
    return res.status(500).json({ error: "Failed to fetch market data" });
  }

  res.status(200).json(data);
};

// Get market data summary (average return rate)
const getMarketDataSummary = async (req, res) => {
  const { data, error } = await supabase
    .from("market_data")
    .select("average_return");

  if (error) {
    console.error("Error fetching market data summary:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch market data summary" });
  }

  // Calculate average return rate
  const totalReturn = data.reduce((sum, item) => sum + item.average_return, 0);
  const averageReturn = totalReturn / data.length;

  res.status(200).json({ averageReturn });
};

module.exports = {
  getMarketData,
  addMarketData,
  getMarketDataBySector,
  getMarketDataSummary,
};
