/**
 * Positions transformation
 */
//% color=#FF5500 weight=10 icon="\uf2f1" advanced=true
//% block="positions X"
//% block.loc.ja="座標変換"
namespace pos_x {

    /**
     * Rotate the position by specifying the origin, axis, and rotation angle
     * @param targetCoordinates Position of rotation target
     * @param origin World position for the center of rotation
     * @param axisOfRevolution Axial direction of rotation
     * @param angle Angle (0~360)
     */
    //% promise
    //% weight=10
    //% blockId=minecraftRotateCoordinate
    //% block="Rotation target positions %targetCoordinates=minecraftCreateWorldInternal| Origin %origin=minecraftCreateWorldInternal| Axis %axisOfRevolution| Angle %angle"
    //% angle.min=0 angle.max=360 angle.defl=60
    //% block.loc.ja="回転対象座標 %targetCoordinates=minecraftCreateWorldInternal| 原点 %origin=minecraftCreateWorldInternal| 軸 %axisOfRevolution| 角度 %angle"
    //% jsdoc.loc.ja="回転の原点、軸、角度を指定して座標を回転させる"
    //% targetCoordinates.loc.ja="回転対象の座標"
    //% origin.loc.ja="回転の中心とするワールド座標"
    //% axisOfRevolution.loc.ja="回転する軸方向"
    //% angle.loc.ja="角度(0~360)"
    export function RotateCoordinate(targetCoordinates: Position, origin: Position, axisOfRevolution: Axis, angle: number): Position {

        //回転軸を表す単位ベクトル
        let n = [0, 0, 0];
        if (axisOfRevolution == Axis.X) {
            n[0] = 1;
        } else if (axisOfRevolution == Axis.Y) {
            n[1] = 1;
        } else if (axisOfRevolution == Axis.Z) {
            n[2] = 1;
        }

        // 角度 ⇒ 弧度　変換
        let 円周率: number = 3.14159;
        let 弧度 = angle * (円周率 / 180);

        // 回転行列
        let sin = Math.sin(弧度);
        let cos = Math.cos(弧度);
        let c1 = 1 - cos;
        let R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        R[0][0] = c1 * (n[0] * n[0]) + cos;
        R[0][1] = c1 * (n[0] * n[1]) - n[2] * sin;
        R[0][2] = c1 * (n[0] * n[2]) + n[1] * sin;
        R[1][0] = c1 * (n[0] * n[1]) + n[2] * sin;
        R[1][1] = c1 * (n[1] * n[1]) + cos
        R[1][2] = c1 * (n[1] * n[2]) - n[0] * sin;
        R[2][0] = c1 * (n[0] * n[2]) - n[1] * sin;
        R[2][1] = c1 * (n[1] * n[2]) + n[0] * sin;
        R[2][2] = c1 * (n[2] * n[2]) + cos;


        //座標を相対座標に変換
        let 相対座標 = pos(
            targetCoordinates.getValue(Axis.X) - origin.getValue(Axis.X)
            , targetCoordinates.getValue(Axis.Y) - origin.getValue(Axis.Y)
            , targetCoordinates.getValue(Axis.Z) - origin.getValue(Axis.Z)
        );

        // 相対座標に回転行列を積算する
        let 回転相対座標 = pos(
            R[0][0] * 相対座標.getValue(Axis.X) + R[0][1] * 相対座標.getValue(Axis.Y) + R[0][2] * 相対座標.getValue(Axis.Z)
            , R[1][0] * 相対座標.getValue(Axis.X) + R[1][1] * 相対座標.getValue(Axis.Y) + R[1][2] * 相対座標.getValue(Axis.Z)
            , R[2][0] * 相対座標.getValue(Axis.X) + R[2][1] * 相対座標.getValue(Axis.Y) + R[2][2] * 相対座標.getValue(Axis.Z)
        );

        //絶対座表示変換
        let 結果 = positions.add(origin, 回転相対座標);
        //player.say("(" + 結果.getValue(Axis.X) + ", " + 結果.getValue(Axis.Y) + ", " + 結果.getValue(Axis.Z) + ")")
        return 結果;
    }
}