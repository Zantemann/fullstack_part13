CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Dan Abramov', 'https://example.com/dan-blog', 'On let vs const');
INSERT INTO blogs (author, url, title) VALUES ('Laurenz Albe', 'https://example.com/laurenz-blog', 'Gaps in sequences in PostgreSQL');