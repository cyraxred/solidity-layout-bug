// Start - Support direct Mocha run & debug
import hardhat, {ethers, upgrades, } from 'hardhat'
import '@nomiclabs/hardhat-ethers'
import '@openzeppelin/hardhat-upgrades'
// End - Support direct Mocha run & debug

import chai, { expect } from 'chai'
import {solidity} from 'ethereum-waffle'
import { V1, V2, V2__factory } from '../typechain-types'
import { getProxyAdminFactory } from '@openzeppelin/hardhat-upgrades/dist/utils'
import { fetchOrDeployAdmin } from '@openzeppelin/upgrades-core'

chai.use(solidity)

describe('Storage layout', () => {

    const testSuite = (v2ImplName: string): void => {
        it('upgrade with OpenZeppelin', async () => {
            const factoryV1 = await ethers.getContractFactory('V1');
            const v1 = await upgrades.deployProxy(factoryV1, []) as V1;

            await v1.initializeV1();

            expect(await v1.p11()).eq(11);
            expect(await v1.p12()).eq(12);

            const v2 = V2__factory.connect(v1.address, v1.signer);

            expect(await v2.p11()).eq(11);
            expect(await v2.p12()).eq(12);

            const factoryV2 = await ethers.getContractFactory(v2ImplName)

            await upgrades.upgradeProxy(v1.address, factoryV2) as V2; // << fails here
        
            await v2.initializeV2();

            expect(await v2.p21()).eq(21);
            expect(await v2.p22()).eq(22);

            expect(await v1.p11()).eq(11); 
            expect(await v1.p12()).eq(12);

            expect(await v2.p11()).eq(11);
            expect(await v2.p12()).eq(12);
        });

        it('upgrade direct', async () => {
            const factoryV1 = await ethers.getContractFactory('V1');
            const v1 = await upgrades.deployProxy(factoryV1, []) as V1;

            await v1.initializeV1();

            expect(await v1.p11()).eq(11);
            expect(await v1.p12()).eq(12);

            const v2 = V2__factory.connect(v1.address, v1.signer);

            expect(await v2.p11()).eq(11);
            expect(await v2.p12()).eq(12);

            const factoryV2 = await ethers.getContractFactory(v2ImplName);
            const v2Impl = await factoryV2.deploy();

            const adminAddr = await fetchOrDeployAdmin(ethers.provider, () => null as any);
            const factoryAdmin = await getProxyAdminFactory(hardhat);
            const admin = factoryAdmin.attach(adminAddr);
            await admin.upgrade(v1.address, v2Impl.address);

            await v2.initializeV2();

            expect(await v2.p21()).eq(21);
            expect(await v2.p22()).eq(22);

            expect(await v1.p11()).eq(11); // << fails here
            expect(await v1.p12()).eq(12);

            expect(await v2.p11()).eq(11);
            expect(await v2.p12()).eq(12);
        });
    }

    describe('V2 inherits P22a (without interface)', () => testSuite('V2a'))

    describe('V2 inherits P22 (with interface)', () => testSuite('V2'))
})
