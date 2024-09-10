import { create } from 'zustand';
import { contentService } from '../services/contentService';

export const useContentStore = create((set) => ({
  userDictionary: null,
  generatedIdeas: [],
  processContentAspiration: async (data) => {
    try {
      const result = await contentService.processContentAspiration(data);
      set({ userDictionary: { ...result.meta_creator, ...result.meta_content } });
    } catch (error) {
      console.error('Content aspiration processing failed:', error);
    }
  },
  generateIdeas: async (data) => {
    try {
      const result = await contentService.generateIdeas(data);
      set({ generatedIdeas: result.ideas });
    } catch (error) {
      console.error('Idea generation failed:', error);
    }
  }
}));