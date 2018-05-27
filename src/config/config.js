import convict from 'convict';

export default convict({
    ENV: {
        doc: 'The application environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
    },
    OUTBOUND_URL: {
        doc: 'The URL to proxify',
        format: String,
        default: 'https://api.github.com',
        env: 'OUTBOUND_URL',
    },
});
