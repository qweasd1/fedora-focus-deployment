import { getConnection, Repository } from 'typeorm';
import { Component ,Inject} from "@nestjs/common";
import { SystemAdminEntity} from "./systemAdmin.entity";
import { ISystemAdmin,ISystemAdminService} from "./Interfaces";
import { CommunityMemberEntity } from '../CommunityMembers/communityMember.entity';


@Component()
export class SystemAdminService implements ISystemAdminService{
    constructor(
        @Inject('SystemAdminRepository') private readonly systemAdminRepository :Repository<SystemAdminEntity>
    ){}

    public async getAllSystemAdmin():Promise<Array<SystemAdminEntity>>{
        return await this.systemAdminRepository.find();
    }

    public async getSystemAdmin(id:number):Promise<SystemAdminEntity | null>{
        return await this.systemAdminRepository.findOneById(id);
    }

    public async addSystemAdmin(systemAdmin:ISystemAdmin):Promise<SystemAdminEntity>{
        return await  this.systemAdminRepository.save(systemAdmin);
    }

    public async updateSystemAdmin(id:number,newSystemAdmin:ISystemAdmin):Promise<SystemAdminEntity|null>{
        const systemAdmin = await this.systemAdminRepository.findOneById(id);
        if(!systemAdmin){
            console.log("system admin does not exist");
        }else{
            await this.systemAdminRepository.updateById(id,newSystemAdmin);
            return await this.systemAdminRepository.findOneById(id);
        }
    }

    public async deleteSystemAdmin(id:number):Promise<string>{
        await this.systemAdminRepository.deleteById(id);
        const systemAdmin = await this.systemAdminRepository.findOneById(id);
        if(!systemAdmin){
            return 'delete success';
        }else{
            return 'delete fail';
        }
    }

    public async countCommunityMemberInSystem():Promise<number>{
        return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
          .getCount();
    }

    public async countCommunityMemberGroupByState():Promise<object>{
        return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
          .select("communityMember.state AS state")
          .addSelect("COUNT(*) AS count")
          .groupBy("communityMember.state")
          .getRawMany();
    }

    public async countCommunityMemberByGenderInSystem():Promise<object>{
      return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
        .select("communityMember.gender AS gender")
        .addSelect("COUNT(*) AS count")
        .groupBy("communityMember.gender")
        .getRawMany();
    }

  public async countCommunityMemberByRaceInSystem():Promise<object>{
    return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
      .select("communityMember.race AS race")
      .addSelect("COUNT(*) AS count")
      .groupBy("communityMember.gender")
      .getRawMany();
  }

  public async countCommunityMemberByMarryInSystem():Promise<object>{
    return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
      .select("communityMember.marry AS marry")
      .addSelect("COUNT(*) AS count")
      .groupBy("communityMember.marry")
      .getRawMany();
  }

  public async countCommunityMemberByEducationInSystem():Promise<object>{
    return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
      .select("communityMember.education AS education")
      .addSelect("COUNT(*) AS count")
      .groupBy("communityMember.education")
      .getRawMany();
  }

  public async countCommunityMemberByEmploymentsInSystem():Promise<object>{
    return await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
      .select("communityMember.employments AS employments")
      .addSelect("COUNT(*) AS count")
      .groupBy("communityMember.employments")
      .getRawMany();
  }

  public async countCommunityMemberByAgeInSystem():Promise<object>{
    const selectedCommunityMember = await getConnection().getRepository(CommunityMemberEntity).createQueryBuilder("communityMember")
      .getMany();
    let year = new Date().getFullYear();
    console.log(year);
    let teenager:number = 0;
    let adult:number = 0;
    let senior:number = 0;
    selectedCommunityMember.forEach((item) => {
      let gap = year - Number(item.date.substring(0,4));
      if(gap > 50){
        senior++;
      }else if(gap > 20){
        adult++;
      }else{
        teenager++;
      }
    })
    return [{type:"teenager",count:teenager},{type:"adult",count:adult},{type:"senior",count:senior}];
  }
}