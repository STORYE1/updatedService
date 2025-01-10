const { successResponse, failureResponse } = require('../utils/responseHandler');
const TourService = require('../services/tourService');
const TourRepository = require('../repositories/tourRepository')

class TourController {
    async createTourWithMedia(req, res) {
        try {
            const {

                tour_name,
                tour_title,
                tour_description,
                languages,
                ticket_price,
                leader_name,
                leader_description,
                tour_days,
                tour_timings,
                cities,
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
            } = req.body;

            const user_id = req.user.userId;

            console.log('Received Data:', req.body);
            console.log('Received Files:', req.files);

            // Parse incoming data
            const parsedData = {
                user_id,
                tour_name,
                tour_title,
                tour_description,
                languages: languages ? JSON.parse(languages) : [],
                ticket_price,
                leader_name,
                leader_description,
                tour_days: tour_days ? JSON.parse(tour_days) : [],
                tour_timings: tour_timings ? JSON.parse(tour_timings) : [],
                cities: cities ? JSON.parse(cities) : [],
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
            };

            // Extract leader profile picture URL
            const leaderProfilePicFile = req.files?.leader_profile_pic?.[0];
            const leaderProfilePicURL = leaderProfilePicFile?.location;

            // Extract media files URLs (excluding leader profile pic)
            const mediaFiles = req.files?.media?.map(file => file.location) || [];

            // Ensure leader profile picture is not null (to avoid database validation errors)
            if (!leaderProfilePicURL) {
                throw new Error('Leader profile picture is required.');
            }

            // Add leader profile pic URL to parsedData
            parsedData.leader_profile_pic = leaderProfilePicURL;

            // Call the service function with the correct data
            const result = await TourService.createTourWithMedia(parsedData, mediaFiles);

            // Respond with a valid status code and body
            return successResponse(res, 201, {  // 201 indicates resource creation
                message: 'Tour created successfully',
                data: result,
            });
        } catch (error) {
            console.error('Error creating tour:', error);
            return failureResponse(res, 500, 'Failed to create tour', error.message);
        }
    }


    async updateTourWithMedia(req, res) {
        try {
            const { tourId } = req.params;

            const {

                tour_name,
                tour_title,
                tour_description,
                languages,
                ticket_price,
                leader_name,
                leader_description,
                tour_days,
                tour_timings,
                cities,
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
            } = req.body;

            const user_id = req.user.userId;

            const parsedData = {
                user_id,
                tour_name,
                tour_title,
                tour_description,
                languages: languages ? JSON.parse(languages) : [],
                ticket_price,
                leader_name,
                leader_description,
                tour_days: tour_days ? JSON.parse(tour_days) : [],
                tour_timings: tour_timings ? JSON.parse(tour_timings) : [],
                cities: cities ? JSON.parse(cities) : [],
                category_id,
                guide_name,
                guide_phone,
                guide_email_id,
            };

            console.log('Received Data:', req.body);
            console.log('Received Files:', req.files);


            if (!Array.isArray(parsedData.tour_days) || parsedData.tour_days.length === 0) {
                throw new Error('Tour days must be a non-empty array.');
            }


            if (!Array.isArray(parsedData.tour_timings) || parsedData.tour_timings.length === 0) {
                throw new Error('Tour timings must be a non-empty array.');
            }


            const leaderProfilePicFile = req.files?.leader_profile_pic?.[0];
            const leaderProfilePicURL = leaderProfilePicFile?.location;



            const mediaFiles = req.files?.media?.map(file => file.location) || [];


            if (leaderProfilePicURL) {
                parsedData.leader_profile_pic = leaderProfilePicURL;
            }


            const updatedTour = await TourService.updateTourWithMedia(
                tourId,
                parsedData,
                mediaFiles
            );

            return successResponse(res, 200, {
                message: 'Tour updated successfully',
                data: updatedTour,
            });
        } catch (error) {
            console.error('Error updating tour:', error);
            return failureResponse(res, 500, 'Failed to update tour', error.message);
        }
    };


    async getTourById(req, res) {
        try {
            const { tourId } = req.params;

            // Fetch the tour by ID
            const tour = await TourRepository.getTourById(tourId);

            // Handle case when the tour is not found
            if (!tour) {
                return res.status(404).json({
                    success: false,
                    message: 'Tour not found',
                });
            }

            // Return the tour data directly
            return res.status(200).json({
                success: true,
                message: 'Tour fetched successfully',
                tour,
            });
        } catch (error) {
            console.error('Error fetching tour:', error);

            // Handle unexpected errors
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tour',
                error: error.message,
            });
        }
    }



    async deleteTour(req, res) {
        try {
            const { tourId } = req.params;

            // Call the service method to delete the tour
            const result = await TourService.deleteTourById(tourId);

            // Return success response
            return res.status(200).json({
                message: result.message, // Ensure this accesses the message property correctly
            });
        } catch (error) {
            console.error('Error deleting tour:', error);
            return res.status(500).json({
                message: 'Failed to delete tour',
                error: error.message,
            });
        }
    }

    async getAllTours(req, res) {
        try {
            const userId = req.user.userId;

            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const tours = await TourService.getAllToursByUser(userId);

            return res.status(200).json({
                message: 'Tours fetched successfully',
                data: tours,
            });
        } catch (error) {
            console.error('Error fetching tours:', error);
            return res.status(500).json({
                message: 'Failed to fetch tours',
                error: error.message,
            });
        }
    }


    async getAllToursConsumer(req, res) {
        try {
            // Call the service method to fetch all tours
            const tours = await TourService.getAllToursConsumers();

            // Respond with a valid status code and body
            return res.status(200).json({
                message: 'Tours fetched successfully',
                data: tours,
            });
        } catch (error) {
            console.error('Error fetching tours:', error);
            return res.status(500).json({
                message: 'Failed to fetch tours',
                error: error.message,
            });
        }
    }

    async getToursByCategory(req, res) {
        try {
            const { categoryId } = req.params;

            const tours = await TourService.getToursByCategory(categoryId);

            if (!tours.length) {
                return res.status(404).json({ message: 'No tours found for this category' });
            }

            return res.status(200).json({ tours });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    }



    async getUserTourTitles(req, res) {
        try {
            const userId = req.user.userId;


            const tours = await TourRepository.getUserTourTitles(userId);

            if (!tours || tours.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No tours found for this user',
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Tour titles fetched successfully',
                tours,
            });
        } catch (error) {
            console.error('Error fetching user tour titles:', error);

            return res.status(500).json({
                success: false,
                message: 'Failed to fetch user tour titles',
                error: error.message,
            });
        }
    }




}

module.exports = new TourController();
