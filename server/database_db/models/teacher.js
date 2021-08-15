// 시퀄라이즈 데이터베이스 등록 (교사 데이터 베이스)
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('teacher_db', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_group: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false
        },
        invite_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        access_student: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
    }, {
        timestamps: false,
    });
}