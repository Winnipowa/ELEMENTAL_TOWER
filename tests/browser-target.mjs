/** Test-only address configuration; never exported to the application or engine. */
export const TEST_PORT=Number(process.env.ELEMENTAL_TEST_PORT||4173);
if(!Number.isInteger(TEST_PORT)||TEST_PORT<1||TEST_PORT>65535)throw new Error('Invalid ELEMENTAL_TEST_PORT');
export const TEST_ORIGIN=`http://127.0.0.1:${TEST_PORT}`;
export const APP_URL=TEST_ORIGIN+'/meta/index.html';
