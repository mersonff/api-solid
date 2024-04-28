import {
  FindManyNearbyParams,
  GymsRepository,
} from '@/repositories/gyms-repository'
import { Gym, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = prisma.gym.create({
      data,
    })
    return gym
  }

  async findById(id: string) {
    const gym = prisma.gym.findUnique({
      where: {
        id,
      },
    })
    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return gyms
  }
}
