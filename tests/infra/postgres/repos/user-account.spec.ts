import type { LoadUserAccountRepository } from "@/data/contracts/repos";

import { type IBackup, newDb } from "pg-mem";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(
    params: LoadUserAccountRepository.Params
  ): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await PgUser.findOne({ where: { email: params.email } });
    if (pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }
}

// Anti corruption layer
@Entity({ name: "usuarios" })
class PgUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "nome", nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: "id_facebook", nullable: true })
  facebookId?: string;
}

describe("PgUserAccountRepository", () => {
  describe("load", () => {
    let sut: PgUserAccountRepository;
    let connection: any;
    let backup: IBackup;

    beforeAll(async () => {
      const db = newDb();
      db.public.registerFunction({
        name: "version",
        args: [],
        implementation: () => "1.0",
      });
      db.public.registerFunction({
        name: "current_database",
        args: [],
        implementation: () => "test_db",
      });
      connection = await db.adapters.createTypeormDataSource({
        type: "postgres",
        entities: [PgUser],
      });
      await connection.initialize();
      await connection.synchronize();
      backup = db.backup();
    });

    beforeEach(() => {
      backup.restore();
      sut = new PgUserAccountRepository();
    });

    afterAll(async () => {
      await connection.close();
    });

    it("should return an account if email exists", async () => {
      const pgUser = new PgUser();
      pgUser.email = "any_email";
      await pgUser.save();

      const sut = new PgUserAccountRepository();

      const account = await sut.load({ email: "any_email" });

      expect(account).toEqual({
        id: "1",
      });
    });

    it("should return undefined if email does not exists", async () => {
      const account = await sut.load({ email: "any_email" });

      expect(account).toBeUndefined();
    });
  });
});
