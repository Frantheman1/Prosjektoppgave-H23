import pool from "../mysql-pool";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export type Question = {
 questionId: number;
 title: string;
 body: string;
 userId: number;
 createdAt: Date;
 updateAt: Date;
 viewCount: number;
}

export type Answer = {
 answerId: number;
 questionId: number;
 userId: number;
 body: string;
 createdAt: Date;
 updateAt: Date;
 score: number;
 isAccepted: boolean;
} 


