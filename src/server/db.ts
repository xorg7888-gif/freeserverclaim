import fs from 'fs';
import path from 'path';

interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

interface Claim {
  id: number;
  user_id: number;
  email: string;
  ip_address: string;
  token: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
}

interface Schema {
  users: User[];
  claims: Claim[];
}

const jsonPath = path.resolve(process.cwd(), 'hdx_database_json.json');

let dbData: Schema = {
  users: [],
  claims: []
};

function loadDb() {
  try {
    if (fs.existsSync(jsonPath)) {
      const content = fs.readFileSync(jsonPath, 'utf8');
      dbData = JSON.parse(content);
    } else {
      saveDb();
    }
  } catch (error) {
    console.error('Failed to load JSON database:', error);
  }
}

function saveDb() {
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(dbData, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save JSON database:', error);
  }
}

export async function initDb(): Promise<void> {
  loadDb();
  if (!dbData.users) dbData.users = [];
  if (!dbData.claims) dbData.claims = [];
  saveDb();
  return Promise.resolve();
}

export function dbRun(sql: string, params: any[] = []): Promise<{ lastID: number; changes: number }> {
  loadDb();
  const sqlClean = sql.replace(/\s+/g, ' ').trim();

  // 1. DELETE FROM claims
  if (sqlClean.toLowerCase().includes('delete from claims')) {
    const prevCount = dbData.claims.length;
    dbData.claims = [];
    saveDb();
    return Promise.resolve({ lastID: 0, changes: prevCount });
  }

  // 2. DELETE FROM users
  if (sqlClean.toLowerCase().includes('delete from users')) {
    const prevCount = dbData.users.length;
    dbData.users = [];
    saveDb();
    return Promise.resolve({ lastID: 0, changes: prevCount });
  }

  // 3. INSERT INTO users
  if (sqlClean.toLowerCase().includes('insert into users')) {
    const id = dbData.users.length > 0 ? Math.max(...dbData.users.map(u => u.id)) + 1 : 1;
    const [email, password_hash, created_at] = params;
    const newUser: User = { id, email, password_hash, created_at };
    dbData.users.push(newUser);
    saveDb();
    return Promise.resolve({ lastID: id, changes: 1 });
  }

  // 4. INSERT INTO claims
  if (sqlClean.toLowerCase().includes('insert into claims')) {
    const id = dbData.claims.length > 0 ? Math.max(...dbData.claims.map(c => c.id)) + 1 : 1;
    const [user_id, email, ip_address, token, created_at, updated_at] = params;
    const newClaim: Claim = {
      id,
      user_id: Number(user_id),
      email,
      ip_address,
      token,
      status: 'pending',
      created_at,
      updated_at,
      approved_at: null,
      rejected_at: null
    };
    dbData.claims.push(newClaim);
    saveDb();
    return Promise.resolve({ lastID: id, changes: 1 });
  }

  // 5. UPDATE claims SET status = "approved"
  if (sqlClean.toLowerCase().includes('update claims set status = "approved"')) {
    const [approved_at, updated_at, claimId] = params;
    const claim = dbData.claims.find(c => c.id === Number(claimId));
    if (claim) {
      claim.status = 'approved';
      claim.approved_at = approved_at;
      claim.updated_at = updated_at;
      saveDb();
      return Promise.resolve({ lastID: Number(claimId), changes: 1 });
    }
    return Promise.resolve({ lastID: 0, changes: 0 });
  }

  // 6. UPDATE claims SET status = "rejected"
  if (sqlClean.toLowerCase().includes('update claims set status = "rejected"')) {
    const [rejected_at, updated_at, claimId] = params;
    const claim = dbData.claims.find(c => c.id === Number(claimId));
    if (claim) {
      claim.status = 'rejected';
      claim.rejected_at = rejected_at;
      claim.updated_at = updated_at;
      saveDb();
      return Promise.resolve({ lastID: Number(claimId), changes: 1 });
    }
    return Promise.resolve({ lastID: 0, changes: 0 });
  }

  // Fallback for tables creations
  if (sqlClean.toLowerCase().startsWith('create table')) {
    return Promise.resolve({ lastID: 0, changes: 0 });
  }

  console.warn('Unhandled dbRun SQL statement:', sqlClean, params);
  return Promise.resolve({ lastID: 0, changes: 0 });
}

export function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  loadDb();
  const sqlClean = sql.replace(/\s+/g, ' ').trim();

  // 1. SELECT COUNT / SUM stats
  if (sqlClean.toLowerCase().includes('select count(*) as total')) {
    const claims = dbData.claims;
    const total = claims.length;
    const pending = claims.filter(c => c.status === 'pending').length;
    const approved = claims.filter(c => c.status === 'approved').length;
    const rejected = claims.filter(c => c.status === 'rejected').length;
    return Promise.resolve({ total, pending, approved, rejected } as any);
  }

  // 2. SELECT * FROM users WHERE email = ?
  if (sqlClean.toLowerCase().includes('from users where email =')) {
    const targetEmail = String(params[0]).trim().toLowerCase();
    const user = dbData.users.find(u => u.email.toLowerCase() === targetEmail);
    return Promise.resolve(user as any);
  }

  // 3. SELECT * FROM users WHERE id = ?
  if (sqlClean.toLowerCase().includes('from users where id =')) {
    const targetId = Number(params[0]);
    const user = dbData.users.find(u => u.id === targetId);
    return Promise.resolve(user as any);
  }

  // 4. SELECT * FROM claims WHERE user_id = ?
  if (sqlClean.toLowerCase().includes('from claims where user_id =')) {
    const targetUserId = Number(params[0]);
    const claim = dbData.claims.find(c => c.user_id === targetUserId);
    return Promise.resolve(claim as any);
  }

  // 5. SELECT * FROM claims WHERE ip_address = ?
  if (sqlClean.toLowerCase().includes('from claims where ip_address =')) {
    const targetIp = String(params[0]).trim();
    const claim = dbData.claims.find(c => c.ip_address === targetIp);
    return Promise.resolve(claim as any);
  }

  // 6. SELECT * FROM claims WHERE token = ?
  if (sqlClean.toLowerCase().includes('from claims where token =')) {
    const targetToken = String(params[0]).trim();
    const claim = dbData.claims.find(c => c.token === targetToken);
    return Promise.resolve(claim as any);
  }

  // 7. SELECT * FROM claims WHERE id = ?
  if (sqlClean.toLowerCase().includes('from claims where id =')) {
    const targetId = Number(params[0]);
    const claim = dbData.claims.find(c => c.id === targetId);
    return Promise.resolve(claim as any);
  }

  console.warn('Unhandled dbGet SQL statement:', sqlClean, params);
  return Promise.resolve(undefined);
}

export function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  loadDb();
  const sqlClean = sql.replace(/\s+/g, ' ').trim();

  // 1. SELECT * FROM claims list
  if (sqlClean.toLowerCase().includes('from claims')) {
    let result = [...dbData.claims];
    let paramIndex = 0;

    // Filter by status if present
    if (sqlClean.toLowerCase().includes('status = ?')) {
      const statusVal = params[paramIndex];
      paramIndex++;
      result = result.filter(c => c.status === statusVal);
    }

    // Filter by search query "LOWER(email) LIKE ? OR ip_address LIKE ? OR token LIKE ?"
    if (sqlClean.toLowerCase().includes('like ?')) {
      const queryValRaw = params[paramIndex];
      paramIndex += 3; // Skip 3 identical parameters for the same search string
      if (queryValRaw) {
        const queryValClean = String(queryValRaw).replace(/%/g, '').trim().toLowerCase();
        if (queryValClean) {
          result = result.filter(c => 
            c.email.toLowerCase().includes(queryValClean) ||
            c.ip_address.toLowerCase().includes(queryValClean) ||
            c.token.toLowerCase().includes(queryValClean)
          );
        }
      }
    }

    // Sort by created_at DESC
    if (sqlClean.toLowerCase().includes('order by created_at d')) {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return Promise.resolve(result as any[]);
  }

  console.warn('Unhandled dbAll SQL statement:', sqlClean, params);
  return Promise.resolve([]);
}

