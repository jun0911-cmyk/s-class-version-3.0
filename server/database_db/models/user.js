// 시퀄라이즈 데이터베이스 등록 (유저 데이터 베이스)
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_db', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_group: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: false
        },
        select_teacher: {
            type: DataTypes.STRING,
            allowNull: false
        },
        create_account: {
            type: DataTypes.DATE,
            allowNull: false
        },
    }, {
        timestamps: false,
    });
}