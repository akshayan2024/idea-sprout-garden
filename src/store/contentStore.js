import { create } from 'zustand';
import { contentService } from '../services/contentService';
import { logger } from '../utils/logger';

export const useContentStore = create((set) => ({
  metaCreator: null,
  metaContent: null,
  generatedIdeas: [],
  existingIdeas: [],
  hasUploadedFiles: false,
  processedKeywords: null,
  uploadContentAspiration: async (data) => {
    try {
      logger.info('Uploading content aspiration', { userId: data.user_id });
      const result = await contentService.uploadContentAspiration(data);
      set({ 
        metaCreator: result.meta_creator,
        metaContent: result.meta_content,
        hasUploadedFiles: true,
      });
      logger.info('Content aspiration uploaded successfully', { userId: data.user_id });
    } catch (error) {
      logger.error('Content aspiration upload failed', { error: error.message, userId: data.user_id });
      throw error;
    }
  },
  processContentAspiration: async (userId) => {
    try {
      logger.info('Processing content aspiration', { userId });
      const result = await contentService.processContentAspiration(userId);
      set({ processedKeywords: result.processed_meta });
      logger.info('Content aspiration processed successfully', { userId });
    } catch (error) {
      logger.error('Processing content aspiration failed', { error: error.message, userId });
      throw error;
    }
  },
  generateIdeas: async (data) => {
    try {
      logger.info('Generating ideas', { userId: data.user_id });
      const result = await contentService.generateIdeas(data);
      set({ generatedIdeas: result.generated_idea });
      logger.info('Ideas generated successfully', { userId: data.user_id, count: result.generated_idea.length });
    } catch (error) {
      logger.error('Idea generation failed', { error: error.message, userId: data.user_id });
      throw error;
    }
  },
  fetchExistingIdeas: async (userId) => {
    try {
      logger.info('Fetching existing ideas', { userId });
      const ideas = await contentService.fetchExistingIdeas(userId);
      set({ existingIdeas: ideas });
      logger.info('Existing ideas fetched successfully', { userId, count: ideas.length });
    } catch (error) {
      logger.error('Fetching existing ideas failed', { error: error.message, userId });
      throw error;
    }
  },
}));