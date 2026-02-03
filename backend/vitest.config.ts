import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            reportsDirectory: 'coverage',
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'src/server.ts',
                'src/seed.ts',
                'src/config/**',
                'src/routes/**',
                'src/**/index.ts',
                'src/types/**',
                // Plain models without custom logic
                'src/models/Course.ts',
                'src/models/Enrollment.ts',
                'src/models/Material.ts',
                'src/models/Message.ts'
            ]
        }
    }
});

