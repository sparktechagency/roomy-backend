// support.services.ts
import Support from './support.model';
import { ISupport, ISupportMessage } from './support.interface';
import { ENUM_USER_ROLE } from '../../../enums/user';
import QueryBuilder from '../../../builder/builder.query';

class SupportService {
  async addUserSupportMessage(userData: Partial<ISupport>, message: ISupportMessage, subject: string) {
    const existingThread = await Support.findOne({ 'user.id': userData.id });

    if (existingThread) {
      existingThread.messages.push({ ...message });
      existingThread.latestSubject = subject;
      existingThread.isDismissed = false;
      return await existingThread.save();
    }

    return await Support.create({
      user: userData,
      latestSubject: subject,
      messages: [{ ...message }],
    });
  }

  async addAdminReply(supportId: string, reply: Partial<ISupportMessage>, adminRole: ENUM_USER_ROLE.ADMIN | ENUM_USER_ROLE.SUPER_ADMIN) {
    const support = await Support.findById(supportId);
    if (!support) return null;

    support.messages.push({ ...reply, sender: adminRole });
    await support.save();

    return support;
  }

  async getAllSupport(query: Record<string, unknown>) {
    const result = new QueryBuilder(
      Support.find(),
      query,
    )
      .filter()
      .search(['user.fullName', 'user.email'])
      .sort()
      .pagination()
      .select();

    const totalCount = await result.countTotal();
    const users = await result.modelQuery;

    return {
      meta: totalCount,
      data: users,
    };
  }

  async getSupportByUserId(userId: string) {
    return await Support.findOne({ 'user.id': userId });
  }

  async getSupportById(id: string) {
    return await Support.findById(id);
  }

  async deleteSupportById(id: string) {
    return await Support.findByIdAndDelete(id);
  }
}

export default new SupportService();
