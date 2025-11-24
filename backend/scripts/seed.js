import '../config/env.js'; // Load environment variables
import { sequelize, Lesson, ChatMessage, UserProgress } from '../models/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const parseCSV = (csvContent) => {
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  // First, properly split lines while respecting quoted fields
  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentLine += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        currentLine += char;
      }
    } else if (char === '\n' && !inQuotes) {
      // End of line (only if not in quotes)
      lines.push(currentLine);
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  
  // Add the last line if there's content
  if (currentLine.trim()) {
    lines.push(currentLine);
  }
  
  const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
  
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current); // Add the last value
    
    const obj = {};
    headers.forEach((header, index) => {
      let value = (values[index] || '').trim();
      
      // Remove surrounding quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      
      // Parse JSON arrays
      if (header === 'topics' && value.startsWith('[')) {
        try {
          obj[header] = JSON.parse(value);
        } catch {
          obj[header] = [];
        }
      } else {
        obj[header] = value;
      }
    });
    
    return obj;
  });
};

const seedLessons = async () => {
  try {
    const csvPath = join(__dirname, '../models/Lesson_export.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const lessons = parseCSV(csvContent);

    console.log(`Seeding ${lessons.length} lessons...`);

    for (const lesson of lessons) {
      await Lesson.upsert({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        level: lesson.level,
        topics: lesson.topics || [],
        duration: lesson.duration,
        content: lesson.content,
        created_date: lesson.created_date && lesson.created_date !== '' ? lesson.created_date : new Date(),
        updated_date: lesson.updated_date && lesson.updated_date !== '' ? lesson.updated_date : new Date(),
        created_by_id: lesson.created_by_id || null,
        is_sample: lesson.is_sample === 'true' || lesson.is_sample === true,
      });
    }

    console.log('✅ Lessons seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    throw error;
  }
};

const seedChatMessages = async () => {
  try {
    const csvPath = join(__dirname, '../models/ChatMessage_export.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const messages = parseCSV(csvContent);

    if (messages.length === 0) {
      console.log('No chat messages to seed');
      return;
    }

    console.log(`Seeding ${messages.length} chat messages...`);

    for (const message of messages) {
      // Validate lesson_id exists if provided
      let lessonId = message.lesson_id || null;
      if (lessonId) {
        const lessonCheck = await Lesson.findByPk(lessonId);
        if (!lessonCheck) {
          console.log(`⚠️  Warning: lesson_id "${lessonId}" not found, setting to null`);
          lessonId = null;
        }
      }

      await ChatMessage.upsert({
        id: message.id,
        user_email: message.user_email,
        message: message.message,
        role: message.role,
        lesson_id: lessonId,
        created_date: message.created_date && message.created_date !== '' ? message.created_date : new Date(),
        updated_date: message.updated_date && message.updated_date !== '' ? message.updated_date : new Date(),
        created_by_id: message.created_by_id || null,
        is_sample: message.is_sample === 'true' || message.is_sample === true,
      });
    }

    console.log('✅ Chat messages seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding chat messages:', error);
    throw error;
  }
};

const seedUserProgress = async () => {
  try {
    const csvPath = join(__dirname, '../models/UserProgress_export.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const progressRecords = parseCSV(csvContent);

    if (progressRecords.length === 0) {
      console.log('No user progress to seed');
      return;
    }

    console.log(`Seeding ${progressRecords.length} user progress records...`);

    for (const progress of progressRecords) {
      // Validate lesson_id exists
      const lessonCheck = await Lesson.findByPk(progress.lesson_id);
      if (!lessonCheck) {
        console.log(`⚠️  Warning: lesson_id "${progress.lesson_id}" not found, skipping progress record`);
        continue;
      }

      await UserProgress.upsert({
        id: progress.id,
        user_email: progress.user_email,
        lesson_id: progress.lesson_id,
        completed: progress.completed === 'true' || progress.completed === true,
        progress_percentage: parseInt(progress.progress_percentage) || 0,
        created_date: progress.created_date && progress.created_date !== '' ? progress.created_date : new Date(),
        updated_date: progress.updated_date && progress.updated_date !== '' ? progress.updated_date : new Date(),
        created_by_id: progress.created_by_id || null,
        is_sample: progress.is_sample === 'true' || progress.is_sample === true,
      });
    }

    console.log('✅ User progress seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding user progress:', error);
    throw error;
  }
};

const seed = async () => {
  try {
    await seedLessons();
    await seedChatMessages();
    await seedUserProgress();
    console.log('✅ All seed data loaded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seed();

