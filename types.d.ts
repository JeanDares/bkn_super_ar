// types.d.ts

declare namespace Express {
    interface Request {
        session: any; // ou use uma tipagem mais específica se souber a estrutura da sua sessão
    }
}

declare module 'express-session' {
    interface SessionData {
      token: string;  // Adicione isto
      // ... qualquer outro campo personalizado que você deseja adicionar
    }
  }