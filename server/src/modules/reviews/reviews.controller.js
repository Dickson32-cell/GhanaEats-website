import * as reviewService from './reviews.service.js';
import { success } from '../../utils/apiResponse.js';

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    success(res, review, 'Review created successfully');
  } catch (err) {
    next(err);
  }
};

export const getMenuItemReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getMenuItemReviews(req.params.menuItemId);
    success(res, reviews);
  } catch (err) {
    next(err);
  }
};

export const getMenuItemAverageRating = async (req, res, next) => {
  try {
    const rating = await reviewService.getMenuItemAverageRating(req.params.menuItemId);
    success(res, rating);
  } catch (err) {
    next(err);
  }
};

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getUserReviews(req.user.id);
    success(res, reviews);
  } catch (err) {
    next(err);
  }
};

export const getOrderReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getOrderReviews(req.params.orderId, req.user.id);
    success(res, reviews);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.user.id, req.body);
    success(res, review, 'Review updated successfully');
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.id, req.user.id);
    success(res, null, 'Review deleted successfully');
  } catch (err) {
    next(err);
  }
};
