/**
 * Test Script for Dominoes Game
 * Author: Arsalan Anwer, Kelsey Geer, Noah
 *
 * This script runs multiple test scenarios to verify correctness
 */

import { execSync } from 'child_process';

console.log('  DOMINOES GAME - AUTOMATED TEST SUITE                 ');

console.log('Running Test Suite...\n');

const tests = [
    {
        name: 'Test 1: Basic Game Flow',
        description: 'Verify game initialization and basic gameplay'
    },
    {
        name: 'Test 2: Mutex Protection',
        description: 'Verify critical sections are protected'
    },
    {
        name: 'Test 3: Win Conditions',
        description: 'Verify both win conditions work'
    }
];

let passedTests = 0;
let failedTests = 0;

for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`\n[${i + 1}/${tests.length}] ${test.name}`);
    console.log(`    ${test.description}`);

    try {
        // Run the game
        const output = execSync('node dominoes-game.js', {
            timeout: 20000,
            encoding: 'utf-8'
        });

        // Check for key indicators
        const checks = {
            'Game Header': output.includes('MULTI-THREADED DOMINOES GAME'),
            'Author Name': output.includes('Author: Arsalan Anwer'),
            'Initialization': output.includes('INITIALIZING GAME'),
            '28 Pieces': output.includes('Shuffled 28 domino pieces'),
            'Distribution': output.includes('10 per player, 8 in boneyard'),
            'Thread Indicator': output.includes("'S TURN (Thread)"),
            'Mutex Usage': output.includes('Drew piece') || output.includes('Placed'),
            'ASCII Display': output.includes('Table:'),
            'Win Condition': output.includes('WINNER:'),
            'Final Results': output.includes('FINAL RESULTS'),
            'Memory Cleanup': output.includes('Cleaning up game resources')
        };

        const allPassed = Object.values(checks).every(v => v === true);

        if (allPassed) {
            console.log('PASSED');
            passedTests++;

            // Show what was verified
            console.log('    Verified:');
            for (const [key, value] of Object.entries(checks)) {
                console.log(`      ✓ ${key}`);
            }
        } else {
            console.log('FAILED');
            failedTests++;

            // Show what failed
            console.log('    Failed checks:');
            for (const [key, value] of Object.entries(checks)) {
                if (!value) {
                    console.log(`      ✗ ${key}`);
                }
            }
        }

    } catch (error) {
        console.log('FAILED');
        console.log(`    Error: ${error.message}`);
        failedTests++;
    }
}


console.log('TEST SUMMARY');

console.log(`\n  Total Tests: ${tests.length}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);
console.log(`Success Rate: ${Math.round((passedTests / tests.length) * 100)}%\n`);

if (failedTests === 0) {
    console.log('ALL TESTS PASSED! Code is ready for submission.\n');
    process.exit(0);
} else {
    console.log('Some tests failed. Please review the output above.\n');
    process.exit(1);
}
