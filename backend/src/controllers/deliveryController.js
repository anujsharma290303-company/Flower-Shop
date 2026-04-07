const DEFAULT_BLACKOUT_DATES = ['2026-01-01', '2026-12-25'];

const parseBlackoutDates = () => {
  const envDates = String(process.env.DELIVERY_BLACKOUT_DATES || '')
    .split(',')
    .map((d) => d.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_BLACKOUT_DATES, ...envDates]);
};

const toDateOnly = (date) => date.toISOString().slice(0, 10);

const isSunday = (date) => date.getUTCDay() === 0;

const getAvailableDates = async (req, res) => {
  try {
    const { zipCode, state } = req.query || {};

    if (!zipCode || !state) {
      return res.status(400).json({ success: false, message: 'zipCode and state are required query params' });
    }

    const blackoutDates = parseBlackoutDates();
    const daysToScan = 45;
    const maxResults = 20;
    const now = new Date();
    const candidates = [];

    for (let i = 1; i <= daysToScan; i += 1) {
      const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + i));
      const dateOnly = toDateOnly(d);

      if (isSunday(d)) continue;
      if (blackoutDates.has(dateOnly)) continue;

      candidates.push(dateOnly);
      if (candidates.length >= maxResults) break;
    }

    return res.json({
      success: true,
      data: {
        zipCode: String(zipCode),
        state: String(state),
        rules: {
          sundaysAvailable: false,
          blackoutDates: [...blackoutDates],
        },
        availableDates: candidates,
      },
    });
  } catch (error) {
    console.error('[DeliveryController] getAvailableDates error:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAvailableDates,
};
