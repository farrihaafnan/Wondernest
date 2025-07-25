DROP TABLE IF EXISTS puzzle_attempts;
DROP TABLE IF EXISTS picture_puzzles;
DROP TABLE IF EXISTS sentence_correction;
DROP TABLE IF EXISTS word_matching;
DROP TABLE IF EXISTS screen_time_logs;
DROP TABLE IF EXISTS behavior_flags;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS children;
DROP TABLE IF EXISTS parents;


CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

CREATE TABLE children (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    age INTEGER CHECK (age >= 0),
    gender TEXT NOT NULL,
    avatar_url TEXT
);


CREATE TABLE picture_puzzles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level INTEGER NOT NULL CHECK (level IN (3, 4, 5)),
    image_url TEXT[] NOT NULL
);

CREATE TABLE puzzle_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    puzzle_id UUID NOT NULL REFERENCES picture_puzzles(id) ON DELETE CASCADE,
    attempts INTEGER NOT NULL CHECK (attempts >= 0),
    is_solved INTEGER NOT NULL
); 


CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    story_text TEXT NOT NULL,
    image_urls TEXT[] NOT NULL,
    title TEXT
);

CREATE TABLE word_matching (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    letter_range TEXT NOT NULL,      
    score INTEGER CHECK (score >= 0),
	attempted_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE sentence_correction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    score INTEGER CHECK (score >= 0),
	attempted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE behavior_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,         
    submitted_text TEXT NOT NULL,        
    offensive_words TEXT NOT NULL,     
    flagged_at TIMESTAMP DEFAULT NOW(),
    is_seen BOOLEAN DEFAULT FALSE
);


CREATE TABLE screen_time_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (
        activity_type IN (
            'word_flashcard',
            'picture_puzzle',
            'story_generation',
            'sentence_learning',
            'word_match',
            'sentence_correction'
        )
    ),
    screen_time_seconds INTEGER NOT NULL CHECK (screen_time_seconds >= 0),
    logged_at TIMESTAMP DEFAULT NOW()
);










