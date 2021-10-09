import Sprint, { ISprint } from '@/entities/Sprint';
import SprintData from '@/shared/pld/dataType';
import pool from '@/shared/pool';

export interface ISprintDao {
    get(sprintName: string): Promise<Sprint | null>;
    add(sprintName: string, data: SprintData): Promise<boolean>;
    delete(sprintName: string): Promise<boolean>;
    updateName(oldName: string, newName: string): Promise<Sprint | null>;
    updateData(sprintName: string, data: SprintData): Promise<Sprint | null>;
    list(): Promise<Sprint[]>;
}

class SprintDaoClass implements ISprintDao {
    async get(sprintName: string): Promise<Sprint | null> {
        return await pool.query<ISprint>(
            'select * from sprints where sprint_name = $1',
            [sprintName]
        )
            .then(res => {
                if (res.rowCount === 0)
                    return null;
                return new Sprint(res.rows[0]);
            })
            .catch(_err => null);
    }

    async add(sprintName: string, data: SprintData): Promise<boolean> {
        return await pool.query<ISprint>(
            'insert into sprints (sprint_name, "data") values ($1, $2) returning *',
            [sprintName, data]
        )
            .then(res => res.rowCount === 1)
            .catch(_err => false);
    }

    async delete(sprintName: string): Promise<boolean> {
        return await pool.query<ISprint>(
            'delete from sprints where sprint_name = $1 returning *',
            [sprintName]
        )
            .then(res => res.rowCount === 1)
            .catch(_err => false);
    }

    async updateName(oldName: string, newName: string): Promise<Sprint | null> {
        return await pool.query<ISprint>(
            'update sprints set sprint_name = $1 where sprint_name = $2 returning *',
            [newName, oldName]
        )
            .then(res => new Sprint(res.rows[0]))
            .catch(_err => null);
    }

    async updateData(sprintName: string, data: SprintData): Promise<Sprint | null> {
        return await pool.query<ISprint>(
            'update sprints set "data" = $1 where sprint_name = $2 returning *',
            [data, sprintName]
        )
            .then(res => new Sprint(res.rows[0]))
            .catch(_err => null);
    }

    async list(): Promise<Sprint[]> {
        return await pool.query<ISprint>(
            'update sprints set "data" = $1 where sprint_name = $2 returning *',
            []
        )
            .then(res => res.rows.map(value => new Sprint(value)))
            .catch(_err => []);
    }
}

const SprintDao = new SprintDaoClass();
export default SprintDao;
