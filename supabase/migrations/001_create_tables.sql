-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  risk_profile TEXT DEFAULT 'moderate',
  investment_goal TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- portfolios table  
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  allocation_json JSONB NOT NULL,
  risk_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- research_documents table
CREATE TABLE research_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT,
  embedding_status TEXT DEFAULT 'pending',
  summary TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- financial_news table
CREATE TABLE financial_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  sentiment TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- chat_history table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Basic Policies for users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Basic Policies for portfolios
CREATE POLICY "Users can view their own portfolios" ON portfolios FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own portfolios" ON portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Basic Policies for research_documents
CREATE POLICY "Users can view their own documents" ON research_documents FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can insert their own documents" ON research_documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

-- Basic Policies for financial_news
CREATE POLICY "Anyone can view news" ON financial_news FOR SELECT USING (true);

-- Basic Policies for chat_history
CREATE POLICY "Users can view their own chat history" ON chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chat history" ON chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
