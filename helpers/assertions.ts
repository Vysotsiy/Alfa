import {expect} from 'chai';

export class Assertions {
    public  async expectToHaveMembers(result: any[], expectedResult: any[], errorMessage?: string): Promise<void> {
        await expect(result).to.have.same.deep.members(expectedResult);
    }
}