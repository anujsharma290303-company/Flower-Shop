const { CreditTransaction, User, Order, sequelize } = require('../models');

const ALLOWED_EARN_REASONS = ['photo_shared', 'video_shared', 'social_share', 'ugc_post'];

const handleControllerError = (res, error, context) => {
  console.error(`[CreditsController] ${context}:`, error.message);
  return res.status(500).json({ success: false, message: 'Internal server error' });
};

const parsePositiveInt = (value) => {
  const numberValue = Number(value);
  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return null;
  }
  return numberValue;
};

const earn = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { amount, reason } = req.body || {};

    const parsedAmount = parsePositiveInt(amount);
    if (!parsedAmount) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'amount must be a positive integer' });
    }

    if (!reason || !ALLOWED_EARN_REASONS.includes(reason)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `reason must be one of: ${ALLOWED_EARN_REASONS.join(', ')}`,
      });
    }

    const user = await User.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newBalance = Number(user.credits) + parsedAmount;
    await user.update({ credits: newBalance }, { transaction });

    const creditTx = await CreditTransaction.create(
      {
        userId,
        amount: parsedAmount,
        type: 'earn',
        reason,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Credits earned successfully',
      data: {
        transaction: creditTx,
        balance: newBalance,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return handleControllerError(res, error, 'Earn credits error');
  }
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await CreditTransaction.findAll({
      where: { userId },
      include: [{ model: Order, as: 'order', attributes: ['id', 'totalPrice', 'status'] }],
      order: [['createdAt', 'DESC']],
      limit: 100,
    });

    return res.json({ success: true, data: history });
  } catch (error) {
    return handleControllerError(res, error, 'Get credit history error');
  }
};

module.exports = {
  earn,
  getHistory,
};
